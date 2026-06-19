import express, { Request, Response } from 'express';
import { businessIntelligenceService } from '../../../src/services/BusinessIntelligenceService.js';
import type { MarketTrendsParams, RiskAssessmentParams } from '../../../src/types/core/index.js';

const router = express.Router();

/**
 * @route   POST /api/business-intelligence/company/analyze
 * @desc    Analyze company comprehensive report
 * @access  Private
 */
router.post('/company/analyze', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required and must be a string',
      });
    }

    const report = await businessIntelligenceService.analyzeCompany(query);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error analyzing company:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/business-intelligence/market/trends
 * @desc    Get market trends data
 * @access  Private
 */
router.get('/market/trends', async (req: Request, res: Response) => {
  try {
    const params: MarketTrendsParams = {
      industry: req.query.industry as string | undefined,
      region: req.query.region as string | undefined,
      timeRange: req.query.timeRange as 'day' | 'week' | 'month' | 'quarter' | 'year' | undefined,
    };

    const trends = await businessIntelligenceService.getMarketTrends(params);

    return res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Error fetching market trends:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/business-intelligence/industry/benchmark/:industry
 * @desc    Get industry benchmark data
 * @access  Private
 */
router.get('/industry/benchmark/:industry', async (req: Request, res: Response) => {
  try {
    const { industry } = req.params;

    if (!industry) {
      return res.status(400).json({
        success: false,
        error: 'Industry parameter is required',
      });
    }

    const benchmark = await businessIntelligenceService.getIndustryBenchmark(industry);

    return res.status(200).json({
      success: true,
      data: benchmark,
    });
  } catch (error) {
    console.error('Error fetching industry benchmark:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   POST /api/business-intelligence/risk/assess
 * @desc    Perform risk assessment
 * @access  Private
 */
router.post('/risk/assess', async (req: Request, res: Response) => {
  try {
    const params: RiskAssessmentParams = req.body;

    if (!params.companyId) {
      return res.status(400).json({
        success: false,
        error: 'companyId is required',
      });
    }

    const assessment = await businessIntelligenceService.assessRisk(params);

    return res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error('Error performing risk assessment:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/business-intelligence/competitors/:companyId
 * @desc    Get competitor analysis
 * @access  Private
 */
router.get('/competitors/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'companyId parameter is required',
      });
    }

    const competitors = await businessIntelligenceService.getCompetitorAnalysis(companyId);

    return res.status(200).json({
      success: true,
      data: competitors,
    });
  } catch (error) {
    console.error('Error fetching competitor analysis:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route   GET /api/business-intelligence/news/:companyId
 * @desc    Get news sentiment analysis
 * @access  Private
 */
router.get('/news/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'companyId parameter is required',
      });
    }

    const analysis = await businessIntelligenceService.getNewsAnalysis(companyId);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error fetching news analysis:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
