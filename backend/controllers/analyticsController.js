const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Alert = require('../models/Alert');

// Get high-level KPI cards metrics
exports.getKPIs = async (req, res) => {
  try {
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const totalCandidates = await Candidate.countDocuments({});
    const interviewsToday = await Candidate.countDocuments({ status: 'Interviewing' });
    const integrityAlerts = await Alert.countDocuments({ resolved: false });

    res.status(200).json({
      activeJobs,
      totalCandidates,
      interviewsToday,
      integrityAlerts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Daily/Weekly Recruitment Overview Line Chart time-series
exports.getRecruitmentOverview = async (req, res) => {
  try {
    const overview = await Candidate.aggregate([
      {
        $group: {
          _id: "$interviewDate",
          Applications: {
            $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] }
          },
          Interviews: {
            $sum: { $cond: [{ $eq: ["$status", "Interviewing"] }, 1, 0] }
          },
          Shortlisted: {
            $sum: { $cond: [{ $eq: ["$status", "Shortlisted"] }, 1, 0] }
          },
          Hired: {
            $sum: { $cond: [{ $eq: ["$status", "Hired"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          Applications: 1,
          Interviews: 1,
          Shortlisted: 1,
          Hired: 1
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    // Seed empty default data to prevent frontend charting errors
    const finalData = overview.length > 0 ? overview : [
      { name: "Jun 18", Applications: 0, Interviews: 0, Shortlisted: 0, Hired: 0 },
      { name: "Jun 19", Applications: 0, Interviews: 0, Shortlisted: 0, Hired: 0 },
      { name: "Jun 20", Applications: 0, Interviews: 0, Shortlisted: 0, Hired: 0 }
    ];

    res.status(200).json(finalData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Hiring Funnel Stage conversion metrics via faceted aggregation
exports.getFunnelMetrics = async (req, res) => {
  try {
    const result = await Candidate.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          screened: [
            { $match: { status: { $in: ['Screening', 'Interviewing', 'Shortlisted', 'Hired'] } } },
            { $count: "count" }
          ],
          interviewed: [
            { $match: { status: { $in: ['Interviewing', 'Shortlisted', 'Hired'] } } },
            { $count: "count" }
          ],
          shortlisted: [
            { $match: { status: { $in: ['Shortlisted', 'Hired'] } } },
            { $count: "count" }
          ],
          hired: [
            { $match: { status: 'Hired' } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const facets = result[0];
    const total = facets.total[0]?.count || 0;
    const screened = facets.screened[0]?.count || 0;
    const interviewed = facets.interviewed[0]?.count || 0;
    const shortlisted = facets.shortlisted[0]?.count || 0;
    const hired = facets.hired[0]?.count || 0;

    const stages = [
      { label: 'Applicants', count: total, percentage: 100 },
      { label: 'Screened', count: screened, percentage: total > 0 ? Math.round((screened / total) * 100) : 0 },
      { label: 'Interviewed', count: interviewed, percentage: total > 0 ? Math.round((interviewed / total) * 100) : 0 },
      { label: 'Shortlisted', count: shortlisted, percentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0 }
    ];

    res.status(200).json({
      total,
      screened,
      interviewed,
      shortlisted,
      hired,
      stages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
