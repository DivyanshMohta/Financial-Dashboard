import express from "express";
import Transaction from "../models/Transaction";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { generateCSV } from "../utils/csvExport";
import fs from "fs";
import path from "path";

const router = express.Router();

// Validation helper functions
const validatePagination = (page: string, limit: string) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return "Page must be a positive number";
  }
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return "Limit must be between 1 and 100";
  }
  return null;
};

const validateDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    return "Invalid start date format";
  }
  if (isNaN(end.getTime())) {
    return "Invalid end date format";
  }
  if (start > end) {
    return "Start date cannot be after end date";
  }
  return null;
};

const validateSortParams = (sortBy: string, order: string) => {
  const validSortFields = ['id', 'date', 'amount', 'category', 'status', 'user_id'];
  const validOrders = ['asc', 'desc'];
  
  if (sortBy && !validSortFields.includes(sortBy)) {
    return `Invalid sort field. Must be one of: ${validSortFields.join(', ')}`;
  }
  if (order && !validOrders.includes(order)) {
    return "Sort order must be 'asc' or 'desc'";
  }
  return null;
};

const validateAmountRange = (minAmount: string, maxAmount: string) => {
  const min = parseFloat(minAmount);
  const max = parseFloat(maxAmount);
  
  if (minAmount && isNaN(min)) {
    return "Invalid minimum amount";
  }
  if (maxAmount && isNaN(max)) {
    return "Invalid maximum amount";
  }
  if (minAmount && maxAmount && min > max) {
    return "Minimum amount cannot be greater than maximum amount";
  }
  return null;
};

// Get transactions with filtering, sorting, and pagination
router.get("/", authenticateJWT as express.RequestHandler, async (req: AuthRequest, res: express.Response) => {
  try {
    // Validate pagination parameters
    const page = req.query.page as string || "1";
    const limit = req.query.limit as string || "10";
    const paginationError = validatePagination(page, limit);
    if (paginationError) {
      res.status(400).json({ error: paginationError });
      return;
    }

    // Validate sort parameters
    const sortBy = req.query.sortBy as string || "date";
    const order = req.query.order as string || "desc";
    const sortError = validateSortParams(sortBy, order);
    if (sortError) {
      res.status(400).json({ error: sortError });
      return;
    }

    // Validate date range if provided
    if (req.query.startDate && req.query.endDate) {
      const dateError = validateDateRange(
        req.query.startDate as string, 
        req.query.endDate as string
      );
      if (dateError) {
        res.status(400).json({ error: dateError });
        return;
      }
    }

    // Validate amount range if provided
    if (req.query.minAmount || req.query.maxAmount) {
      const amountError = validateAmountRange(
        req.query.minAmount as string || '', 
        req.query.maxAmount as string || ''
      );
      if (amountError) {
        res.status(400).json({ error: amountError });
        return;
      }
    }

    // Build filter object from query params
    const filter: any = {};
    
    // Category filter
    if (req.query.category) {
      const validCategories = ['Revenue', 'Expense'];
      if (!validCategories.includes(req.query.category as string)) {
        res.status(400).json({ 
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
        });
        return;
      }
      filter.category = req.query.category;
    }

    // Status filter
    if (req.query.status) {
      const validStatuses = ['Paid', 'Pending'];
      if (!validStatuses.includes(req.query.status as string)) {
        res.status(400).json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
        return;
      }
      filter.status = req.query.status;
    }

    // User ID filter
    if (req.query.user_id) {
      if (typeof req.query.user_id !== 'string' || req.query.user_id.trim().length === 0) {
        res.status(400).json({ error: "User ID must be a non-empty string" });
        return;
      }
      filter.user_id = req.query.user_id.trim();
    }
    
    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    } else if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate as string) };
    } else if (req.query.endDate) {
      filter.date = { $lte: new Date(req.query.endDate as string) };
    }

    // Amount range filtering
    if (req.query.minAmount || req.query.maxAmount) {
      filter.amount = {};
      if (req.query.minAmount) {
        filter.amount.$gte = parseFloat(req.query.minAmount as string);
      }
      if (req.query.maxAmount) {
        filter.amount.$lte = parseFloat(req.query.maxAmount as string);
      }
    }

    // Search functionality
    const search = req.query.search as string;
    if (search) {
      if (search.trim().length === 0) {
        res.status(400).json({ error: "Search term cannot be empty" });
        return;
      }
      if (search.length > 100) {
        res.status(400).json({ error: "Search term too long (max 100 characters)" });
        return;
      }
      
      filter.$or = [
        { category: { $regex: search.trim(), $options: "i" } },
        { status: { $regex: search.trim(), $options: "i" } },
        { user_id: { $regex: search.trim(), $options: "i" } },
        { user_profile: { $regex: search.trim(), $options: "i" } }
      ];
    }

    // Sorting
    const sortOrder = order === "asc" ? 1 : -1;
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query the database
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    // Return results
    res.json({
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        applied: Object.keys(filter).filter(key => key !== '$or'),
        search: search || null
      }
    });

  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ 
      error: "Failed to fetch transactions. Please try again later." 
    });
  }
});

// Get analytics data for dashboard
router.get("/analytics", authenticateJWT as express.RequestHandler, async (req: AuthRequest, res: express.Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date range if provided
    if (startDate && endDate) {
      const dateError = validateDateRange(startDate as string, endDate as string);
      if (dateError) {
        res.status(400).json({ error: dateError });
        return;
      }
    }
    
    // Build date filter
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // 1. Total revenue and expenses
    const revenueExpenses = await Transaction.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // 2. Status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Monthly trends (last 12 months) - with error handling
    let monthlyTrends = [];
    try {
      monthlyTrends = await Transaction.aggregate([
        { $match: dateFilter },
        {
          $addFields: {
            dateField: { $toDate: "$date" }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$dateField" },
              month: { $month: "$dateField" }
            },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$category", "Revenue"] }, "$amount", 0]
              }
            },
            expenses: {
              $sum: {
                $cond: [{ $eq: ["$category", "Expense"] }, "$amount", 0]
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 }
      ]);
    } catch (monthlyError) {
      console.error("Monthly trends aggregation error:", monthlyError);
      // Return empty array if monthly trends fail
      monthlyTrends = [];
    }

    // 4. Top users by transaction volume
    const topUsers = await Transaction.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$user_id",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      revenueExpenses,
      statusBreakdown,
      monthlyTrends,
      topUsers,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ 
      error: "Failed to fetch analytics data. Please try again later." 
    });
  }
});

// Get unique values for filters
router.get("/filters", authenticateJWT as express.RequestHandler, async (req: AuthRequest, res: express.Response) => {
  try {
    const categories = await Transaction.distinct("category");
    const statuses = await Transaction.distinct("status");
    const users = await Transaction.distinct("user_id");

    res.json({
      categories,
      statuses,
      users
    });

  } catch (err) {
    console.error("Filters error:", err);
    res.status(500).json({ 
      error: "Failed to fetch filter options. Please try again later." 
    });
  }
});

// CSV export route
router.post("/export", authenticateJWT as express.RequestHandler, async (req: AuthRequest, res: express.Response) => {
  try {
    const { columns = ["id", "date", "amount", "category", "status", "user_id"], ...filters } = req.body;

    // Validate columns
    const validColumns = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
    const invalidColumns = columns.filter((col: string) => !validColumns.includes(col));
    if (invalidColumns.length > 0) {
      res.status(400).json({ 
        error: `Invalid columns: ${invalidColumns.join(', ')}. Valid columns: ${validColumns.join(', ')}` 
      });
      return;
    }

    // Build filter object (same logic as GET route)
    const filter: any = {};
    
    if (filters.category) {
      const validCategories = ['Revenue', 'Expense'];
      if (!validCategories.includes(filters.category)) {
        res.status(400).json({ 
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
        });
        return;
      }
      filter.category = filters.category;
    }

    if (filters.status) {
      const validStatuses = ['Paid', 'Pending'];
      if (!validStatuses.includes(filters.status)) {
        res.status(400).json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
        return;
      }
      filter.status = filters.status;
    }

    if (filters.user_id) {
      if (typeof filters.user_id !== 'string' || filters.user_id.trim().length === 0) {
        res.status(400).json({ error: "User ID must be a non-empty string" });
        return;
      }
      filter.user_id = filters.user_id.trim();
    }
    
    if (filters.startDate && filters.endDate) {
      const dateError = validateDateRange(filters.startDate, filters.endDate);
      if (dateError) {
        res.status(400).json({ error: dateError });
        return;
      }
      filter.date = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    // Search functionality
    if (filters.search) {
      if (filters.search.trim().length === 0) {
        res.status(400).json({ error: "Search term cannot be empty" });
        return;
      }
      if (filters.search.length > 100) {
        res.status(400).json({ error: "Search term too long (max 100 characters)" });
        return;
      }
      
      filter.$or = [
        { category: { $regex: filters.search.trim(), $options: "i" } },
        { status: { $regex: filters.search.trim(), $options: "i" } },
        { user_id: { $regex: filters.search.trim(), $options: "i" } },
        { user_profile: { $regex: filters.search.trim(), $options: "i" } }
      ];
    }

    // Sorting
    const sortBy = filters.sortBy || "date";
    const order = filters.order === "asc" ? 1 : -1;
    const sort: any = {};
    sort[sortBy] = order;

    // Get filtered data (no pagination for export)
    const transactions = await Transaction.find(filter).sort(sort);

    if (transactions.length === 0) {
      res.status(404).json({ 
        error: "No data found matching the specified filters" 
      });
      return;
    }

    // Generate CSV
    const csvFilePath = await generateCSV(transactions, columns);

    // Send file as download
    res.download(csvFilePath, `transactions_${new Date().toISOString().split('T')[0]}.csv`, (err) => {
      // Clean up the temporary file after sending
      if (fs.existsSync(csvFilePath)) {
        fs.unlinkSync(csvFilePath);
      }
    });

  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ 
      error: "Failed to generate CSV. Please try again later." 
    });
  }
});

export default router;