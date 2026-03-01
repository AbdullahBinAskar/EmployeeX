-- Employee X "Big Brother" Seed Data
-- Single Department: Marketing

-- Department
INSERT INTO department (name, name_ar, director, employee_x_email, color, description) VALUES
('Marketing', 'التسويق', 'Sara Al-Rashid', 'employeex.marketing@gmail.com', '#0EA5E9', 'Marketing department handling brand strategy, content, digital campaigns, partnerships, and SEO.');

-- Employees (8)
INSERT INTO employees (name, role, email, status, avatar, skills, capacity, join_date) VALUES
('Sara Al-Rashid', 'Marketing Director', 'sara@company.com', 'active', '👩‍💼', '["Strategy","Leadership","Brand Management","Budget Planning","Team Building"]', 85, '2022-03-15'),
('Ahmad Nasser', 'Content Lead', 'ahmad@company.com', 'active', '👨‍💻', '["Content Strategy","Copywriting","Video Production","Social Media","Analytics"]', 90, '2022-08-01'),
('Lina Fahad', 'Growth Manager', 'lina@company.com', 'absent', '👩‍💻', '["Growth Hacking","Partnerships","Data Analysis","Campaign Management","CRM"]', 0, '2023-01-10'),
('Rami Hassan', 'Senior Copywriter', 'rami@company.com', 'active', '✍️', '["Copywriting","Arabic Content","Brand Voice","Email Marketing","Storytelling"]', 75, '2023-04-20'),
('Dina Youssef', 'SEO Specialist', 'dina@company.com', 'active', '🔍', '["SEO","SEM","Google Analytics","Keyword Research","Technical SEO","Link Building"]', 95, '2023-06-15'),
('Omar Khalil', 'Digital Campaign Manager', 'omar@company.com', 'active', '📊', '["PPC","Social Ads","Campaign Optimization","A/B Testing","Budget Management"]', 80, '2023-09-01'),
('Nadia Samir', 'Graphic Designer', 'nadia@company.com', 'active', '🎨', '["UI Design","Brand Identity","Adobe Suite","Motion Graphics","Illustration"]', 70, '2024-01-15'),
('Yousef Tariq', 'Marketing Analyst', 'yousef@company.com', 'active', '📈', '["Data Analysis","SQL","Tableau","Market Research","Reporting","Python"]', 88, '2024-03-01');

-- Projects (6)
INSERT INTO projects (name, description, status, health, priority, progress, start_date, target_date, budget, tags) VALUES
('Q1 Marketing Campaign', 'Comprehensive multi-channel marketing campaign for Q1 2026 targeting new customer acquisition and brand awareness across digital and traditional channels.', 'active', 'green', 'critical', 72, '2026-01-05', '2026-03-31', '150,000 SAR', '["campaign","q1","multi-channel","acquisition"]'),
('Video-First Content Strategy', 'Pivot content strategy to video-first approach across YouTube, TikTok, and Instagram Reels. Includes hiring freelance videographers and building internal capability.', 'active', 'yellow', 'high', 45, '2026-01-15', '2026-04-30', '80,000 SAR', '["video","content","social-media","strategy"]'),
('Apex Corp Partnership', 'Strategic co-marketing partnership with Apex Corp for joint webinar series, content collaboration, and lead sharing agreement.', 'active', 'red', 'high', 30, '2026-02-01', '2026-03-15', '25,000 SAR', '["partnership","b2b","apex-corp","co-marketing"]'),
('SEO Optimization Initiative', 'Major technical SEO overhaul: site speed, schema markup, content clusters, and link building campaign to improve organic rankings by 40%.', 'active', 'green', 'medium', 55, '2026-01-20', '2026-05-15', '35,000 SAR', '["seo","technical","organic","optimization"]'),
('Brand Refresh', 'Update brand guidelines, logo refinement, new color palette, typography system, and rollout across all touchpoints including website and social media.', 'planning', 'green', 'medium', 10, '2026-03-01', '2026-06-30', '60,000 SAR', '["brand","design","identity","refresh"]'),
('Annual Marketing Report', 'Comprehensive analysis of 2025 marketing performance, ROI metrics, channel effectiveness, and strategic recommendations for 2026.', 'active', 'yellow', 'high', 65, '2026-02-10', '2026-03-10', '5,000 SAR', '["report","analytics","annual","2025"]');

-- Project Members
-- Q1 Marketing Campaign (project 1)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(1, 1, 'lead'), (1, 2, 'member'), (1, 6, 'member'), (1, 7, 'member'), (1, 8, 'reviewer');
-- Video-First Content Strategy (project 2)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(2, 2, 'lead'), (2, 4, 'member'), (2, 7, 'member');
-- Apex Corp Partnership (project 3)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(3, 3, 'lead'), (3, 1, 'reviewer'), (3, 4, 'member');
-- SEO Optimization Initiative (project 4)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(4, 5, 'lead'), (4, 2, 'member'), (4, 8, 'reviewer');
-- Brand Refresh (project 5)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(5, 7, 'lead'), (5, 1, 'reviewer'), (5, 4, 'member');
-- Annual Marketing Report (project 6)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(6, 8, 'lead'), (6, 1, 'reviewer'), (6, 5, 'member');

-- Milestones
INSERT INTO milestones (project_id, title, due_date, status) VALUES
(1, 'Campaign brief approved', '2026-01-15', 'completed'),
(1, 'Creative assets finalized', '2026-02-10', 'completed'),
(1, 'Campaign launch', '2026-02-20', 'completed'),
(1, 'Mid-campaign optimization', '2026-03-10', 'in_progress'),
(1, 'Final performance report', '2026-03-31', 'pending'),
(2, 'Content audit complete', '2026-02-01', 'completed'),
(2, 'Video production pipeline set up', '2026-02-28', 'overdue'),
(2, 'First 10 videos published', '2026-03-31', 'pending'),
(3, 'Partnership agreement signed', '2026-02-15', 'completed'),
(3, 'Joint webinar #1', '2026-03-01', 'in_progress'),
(3, 'Content collaboration launch', '2026-03-15', 'pending'),
(4, 'Technical audit complete', '2026-02-15', 'completed'),
(4, 'Schema markup implemented', '2026-03-01', 'in_progress'),
(4, 'Content clusters published', '2026-04-01', 'pending'),
(5, 'Brand audit & research', '2026-03-15', 'pending'),
(6, 'Data collection complete', '2026-02-25', 'completed'),
(6, 'Draft report', '2026-03-05', 'in_progress');

-- Deliverables (20)
INSERT INTO deliverables (project_id, assignee_id, title, description, status, priority, due_date, delay_days) VALUES
-- Q1 Campaign
(1, 6, 'Google Ads campaign setup', 'Set up and launch Google Ads campaigns for Q1 targeting keywords', 'in_progress', 'critical', '2026-03-05', 0),
(1, 6, 'Social media ad creatives', 'Design and deploy social media ad sets for Instagram, LinkedIn, Twitter', 'completed', 'high', '2026-02-20', 0),
(1, 7, 'Campaign landing pages', 'Design 3 landing pages for campaign segments', 'in_progress', 'high', '2026-03-01', 2),
(1, 2, 'Campaign email sequences', 'Write 5-part email nurture sequence for campaign leads', 'in_progress', 'high', '2026-03-08', 0),
(1, 8, 'Campaign analytics dashboard', 'Build real-time analytics dashboard for campaign KPIs', 'completed', 'medium', '2026-02-25', 0),
-- Video Content
(2, 2, 'Video content calendar', 'Plan 30-day video content calendar for all platforms', 'in_progress', 'high', '2026-03-05', 0),
(2, 4, 'Video scripts batch 1', 'Write scripts for first 5 videos (product explainers)', 'in_progress', 'high', '2026-03-10', 0),
(2, 7, 'Video thumbnails & graphics', 'Design thumbnail templates and motion graphic intros', 'not_started', 'medium', '2026-03-15', 0),
-- Apex Corp
(3, 3, 'Partnership proposal deck', 'Finalize co-marketing partnership proposal for Apex Corp', 'blocked', 'critical', '2026-02-25', 4),
(3, 4, 'Joint webinar content', 'Write content and slides for joint webinar with Apex Corp', 'in_progress', 'high', '2026-03-05', 0),
(3, 3, 'Lead sharing framework', 'Define lead qualification criteria and sharing mechanism', 'blocked', 'high', '2026-03-01', 0),
-- SEO
(4, 5, 'Technical SEO audit report', 'Complete technical SEO audit with prioritized fix list', 'completed', 'critical', '2026-02-15', 0),
(4, 5, 'Schema markup implementation', 'Implement structured data across all key pages', 'in_progress', 'high', '2026-03-10', 0),
(4, 2, 'SEO content clusters', 'Write 3 content clusters (15 articles) targeting priority keywords', 'in_progress', 'medium', '2026-04-01', 0),
(4, 5, 'Link building outreach', '50 outreach emails to target sites for backlink acquisition', 'not_started', 'medium', '2026-03-20', 0),
-- Brand Refresh
(5, 7, 'Brand audit presentation', 'Research and present current brand perception analysis', 'not_started', 'high', '2026-03-15', 0),
(5, 7, 'Logo refinement concepts', '3 logo refinement directions with mockups', 'not_started', 'medium', '2026-03-25', 0),
-- Annual Report
(6, 8, 'Data analysis & charts', 'Analyze 2025 marketing data and create visualization charts', 'in_progress', 'high', '2026-03-03', 0),
(6, 5, 'SEO performance section', 'Write organic search performance section with YoY comparison', 'in_progress', 'medium', '2026-03-05', 0),
(6, 1, 'Executive summary & recommendations', 'Write executive summary and 2026 strategic recommendations', 'not_started', 'high', '2026-03-08', 0);

-- Emails (25) - All CCed to Employee X
INSERT INTO emails (from_address, to_address, cc, subject, body, date, classification, status, priority, project_id, employee_id) VALUES
('sara@company.com', 'team@company.com', 'employeex.marketing@gmail.com', 'Q1 Campaign Launch Update', 'Team, great news — our Q1 campaign went live on schedule. Initial metrics look promising with a 3.2% CTR on Google Ads. Omar, please share the first 48-hour performance snapshot by EOD tomorrow. Ahmad, ensure the email sequences are queued and tested.', '2026-02-21 09:15:00', 'update', 'read', 'normal', 1, 1),
('omar@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'RE: Q1 Campaign - 48hr Performance', 'Sara, here are the numbers: Google Ads CTR 3.2%, Social ads CTR 2.8%, Landing page conversion 4.1%. Budget spend on track at 18% of total. Recommend increasing LinkedIn budget by 15% based on higher quality leads. Full deck attached.', '2026-02-22 14:30:00', 'update', 'read', 'normal', 1, 6),
('lina@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Apex Corp - Partnership Delay', 'Sara, I need to flag that the Apex Corp partnership proposal is delayed. I was supposed to finalize it this week but my absence means it will slip. Their CMO is expecting the deck by March 1st. Can someone pick this up? Key files are in the shared drive under /Partnerships/Apex/', '2026-02-24 11:00:00', 'escalation', 'flagged', 'urgent', 3, 3),
('cmo@apexcorp.com', 'lina@company.com', 'sara@company.com,employeex.marketing@gmail.com', 'RE: Partnership Proposal - Following Up', 'Hi Lina, we haven''t received the co-marketing proposal yet. Our board meeting is March 8th and we need to review it before then. Can you confirm delivery by March 3rd? Thanks, James Chen, CMO Apex Corp', '2026-02-26 16:45:00', 'action_required', 'flagged', 'urgent', 3, 3),
('ahmad@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Video Strategy - Production Pipeline Issue', 'Sara, we hit a snag with the video production pipeline. The freelance videographer we shortlisted backed out. I have 2 backup options but both are more expensive (15-20% over budget). Need your approval to proceed. Also, the video content calendar draft is ready for review.', '2026-02-25 10:20:00', 'action_required', 'read', 'high', 2, 2),
('dina@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'SEO Audit Complete - Quick Wins Identified', 'Sara, the technical SEO audit is done. Found 23 critical issues, 45 medium. Top 3 quick wins: 1) Fix 404 errors (est. +8% organic traffic), 2) Add schema markup to product pages, 3) Optimize Core Web Vitals. Starting fixes this week. Full report attached.', '2026-02-16 09:00:00', 'update', 'read', 'normal', 4, 5),
('sara@company.com', 'dina@company.com', 'employeex.marketing@gmail.com', 'RE: SEO Audit - Approved to Proceed', 'Excellent work Dina. Approved to proceed with all fixes. Prioritize the 404s and schema markup first. Let me know if you need dev team support for the Core Web Vitals work.', '2026-02-16 11:30:00', 'update', 'read', 'normal', 4, 1),
('rami@company.com', 'ahmad@company.com', 'employeex.marketing@gmail.com', 'Video Scripts - First Draft', 'Ahmad, first 2 video scripts are ready for review. I''ve gone with a conversational tone as discussed. Each video is ~3 min. Scripts are in the shared doc. Let me know if the tone works before I continue with the remaining 3.', '2026-02-27 13:15:00', 'update', 'read', 'normal', 2, 4),
('yousef@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Campaign Analytics Dashboard Ready', 'Sara, the real-time analytics dashboard is live. Key metrics tracked: CTR, CPC, conversion rate, lead quality score, channel ROI. Sharing the link. Notable insight: LinkedIn is outperforming our projections by 22%.', '2026-02-24 16:00:00', 'update', 'read', 'normal', 1, 8),
('nadia@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Landing Page Designs - Review Needed', 'Sara, I''ve completed the 3 landing page designs for the campaign segments. They''re in Figma. The enterprise segment page might need copy adjustments — Rami, could you review the headline? Slight delay (2 days) due to last-minute design changes from the brand team.', '2026-02-28 10:00:00', 'action_required', 'unread', 'high', 1, 7),
('sara@company.com', 'team@company.com', 'employeex.marketing@gmail.com', 'Lina''s Absence - Coverage Plan', 'Team, as you know Lina is on leave until March 2nd. Rami will cover the Apex Corp webinar content. For the partnership proposal, I''ll coordinate directly with Apex Corp to buy time. Please flag any other items that were dependent on Lina.', '2026-02-25 08:00:00', 'update', 'read', 'high', 3, 1),
('hr@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Annual Performance Reviews Reminder', 'Hi Sara, reminder that annual performance reviews for your team are due March 15th. Please schedule 1-on-1s with each team member and submit evaluations through the HR portal. Let me know if you need the updated review template.', '2026-02-20 09:00:00', 'action_required', 'read', 'high', NULL, 1),
('omar@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Campaign Budget Alert - LinkedIn Overspend', 'Sara, heads up — LinkedIn ad spend is trending 12% over the allocated budget for this week. The lead quality is great (45% MQL rate vs 30% target) so I think it''s worth it, but need your approval to reallocate from the Twitter budget which is underperforming.', '2026-02-27 11:30:00', 'action_required', 'unread', 'high', 1, 6),
('vendor@printshop.com', 'nadia@company.com', 'employeex.marketing@gmail.com', 'Brand Refresh Materials - Print Quote', 'Hi Nadia, per our discussion, here''s the quote for the brand refresh print materials: Business cards (500 sets): 2,500 SAR, Letterheads (1000): 1,800 SAR, Brochures (500): 4,200 SAR. 15% discount if ordered together. Valid until March 15th.', '2026-02-26 14:00:00', 'fyi', 'read', 'normal', 5, 7),
('ahmad@company.com', 'team@company.com', 'employeex.marketing@gmail.com', 'Content Calendar - March Planning', 'Team, sharing the March content calendar. Key highlights: 12 blog posts, 8 videos (pending production pipeline), 20 social posts, 3 email campaigns, 1 webinar with Apex Corp. Please review your assigned pieces and flag any conflicts by Friday.', '2026-02-28 09:00:00', 'action_required', 'unread', 'normal', NULL, 2),
('dina@company.com', 'ahmad@company.com', 'employeex.marketing@gmail.com', 'SEO Content Brief - Cluster 1', 'Ahmad, here are the content briefs for the first SEO content cluster (5 articles). Target keywords, word counts, and competitor analysis included. Priority keywords have search volume of 5K-15K monthly. Let me know if the brief format works for the writers.', '2026-02-27 10:00:00', 'update', 'read', 'normal', 4, 5),
('yousef@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Monthly Marketing Report Draft', 'Sara, draft of the annual marketing report data section is ready. Key findings: 2025 total leads up 34% YoY, CAC down 12%, best performing channel was organic search (+45%). Need your executive summary and 2026 recommendations to finalize. Target completion by March 10.', '2026-02-28 15:00:00', 'action_required', 'unread', 'high', 6, 8),
('sara@company.com', 'team@company.com', 'employeex.marketing@gmail.com', 'Team Meeting - Q1 Review Prep', 'Team, we have our Q1 review meeting with leadership on March 12th. Each project lead please prepare a 5-minute update: status, key wins, blockers, and next steps. We''ll do a dry run on March 10th. Yousef, please prepare the consolidated metrics deck.', '2026-02-28 16:30:00', 'action_required', 'unread', 'normal', NULL, 1),
('rami@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Apex Corp Webinar Content - Draft', 'Sara, I''ve drafted the content outline for the Apex Corp joint webinar. Topic: "Growth Marketing in 2026 - B2B Strategies That Work". 45-minute format with Q&A. Need Lina to review the partnership-specific messaging when she''s back. Draft slides in shared folder.', '2026-02-28 14:00:00', 'update', 'read', 'normal', 3, 4),
('finance@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Q1 Budget Utilization Check', 'Hi Sara, as of Feb 28, your department has utilized 58% of Q1 budget. You''re on track. Please note the March budget deadline — any unused funds from Q1 cannot be carried over. Let me know if you anticipate any budget adjustments.', '2026-02-28 12:00:00', 'fyi', 'read', 'normal', NULL, NULL),
('omar@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'A/B Test Results - Campaign Landing Pages', 'Sara, A/B test results for the campaign landing pages: Variant B (video header) outperforms Variant A by 28% on conversion rate. Recommend rolling out Variant B across all segments. Also, the mobile version needs Nadia to fix a layout issue.', '2026-02-27 16:00:00', 'update', 'read', 'normal', 1, 6),
('nadia@company.com', 'ahmad@company.com', 'employeex.marketing@gmail.com', 'Video Thumbnail Templates Done', 'Ahmad, the video thumbnail templates are finalized — 5 variants matching our brand. Also created animated intro/outro sequences (10 sec each). Files in the brand assets folder. Ready whenever the videos are shot.', '2026-02-26 11:00:00', 'update', 'read', 'normal', 2, 7),
('dina@company.com', 'sara@company.com', 'employeex.marketing@gmail.com', 'Core Web Vitals - Dev Team Needed', 'Sara, I''ve done everything I can on the SEO side for Core Web Vitals but need the dev team for 3 items: image lazy loading, JS bundle splitting, and server-side caching. Can you request dev support? This could improve our scores from 65 to 85+.', '2026-02-28 11:00:00', 'request', 'unread', 'normal', 4, 5),
('sara@company.com', 'finance@company.com', 'employeex.marketing@gmail.com', 'RE: Budget - LinkedIn Reallocation Request', 'Hi Finance, requesting approval to reallocate 8,000 SAR from Twitter ads budget to LinkedIn. Twitter is underperforming (0.8% CTR) while LinkedIn is exceeding targets (4.2% CTR, 45% MQL rate). This is within our Q1 allocation.', '2026-02-28 10:00:00', 'request', 'read', 'normal', 1, 1),
('ahmad@company.com', 'rami@company.com', 'employeex.marketing@gmail.com', 'RE: Video Scripts - Feedback', 'Rami, great work on the scripts! Tone is perfect. Two small notes: 1) Add a CTA at the 2-minute mark in Script 1, 2) Script 2 needs a stronger hook in the first 10 seconds. Please continue with the remaining 3 scripts. Target: all 5 done by March 10.', '2026-02-27 15:30:00', 'update', 'read', 'normal', 2, 2);

-- Meetings (10)
INSERT INTO meetings (title, date, time, duration_minutes, location, status, project_id, summary, decisions, action_items) VALUES
('Q1 Campaign Weekly Sync', '2026-02-24', '10:00', 60, 'Meeting Room A', 'completed', 1,
  'Reviewed campaign performance after first week. Google Ads performing above target, social ads need optimization. Landing page conversion tracking confirmed working.',
  '["Increase LinkedIn budget by 15% from Twitter allocation","Launch retargeting campaign by Feb 28","Keep Google Ads bid strategy unchanged"]',
  '["Omar: Prepare budget reallocation proposal by Feb 27","Ahmad: Launch email sequence #2 by Feb 26","Yousef: Set up automated weekly report by Feb 28"]'),

('Video Strategy Kickoff', '2026-02-18', '14:00', 90, 'Creative Studio', 'completed', 2,
  'Aligned on video-first content strategy direction. Decided on 3-platform approach. Discussed production workflow and resource needs.',
  '["Focus on YouTube Shorts + TikTok + Instagram Reels","Hire freelance videographer (budget approved)","Ahmad leads content calendar, Rami writes scripts"]',
  '["Ahmad: Complete video content calendar by Mar 5","Rami: First batch of 5 scripts by Mar 10","Nadia: Design thumbnail templates by Feb 26"]'),

('Apex Corp Partnership Planning', '2026-02-15', '11:00', 60, 'Virtual - Zoom', 'completed', 3,
  'Met with Apex Corp CMO to discuss partnership structure. Agreed on joint webinar series and content collaboration. Lead sharing terms need legal review.',
  '["3-webinar series starting March 2026","Shared content library for both brands","Lead sharing with 30-day exclusivity window"]',
  '["Lina: Finalize partnership proposal deck by Feb 25","Rami: Draft webinar #1 content by Mar 5","Sara: Schedule legal review for lead sharing agreement"]'),

('SEO Initiative Progress Review', '2026-02-20', '09:00', 45, 'Meeting Room B', 'completed', 4,
  'Reviewed technical SEO audit findings. 23 critical issues identified. Quick wins prioritized for immediate action. Dev team support needed for CWV.',
  '["Prioritize 404 fixes and schema markup","Request dev team support for Core Web Vitals","Content clusters to target 15 priority keywords"]',
  '["Dina: Begin 404 fixes immediately","Dina: Submit dev support request for CWV","Ahmad: Start content cluster writing by Mar 1"]'),

('All-Hands Marketing Standup', '2026-02-27', '09:00', 30, 'Open Floor', 'completed', NULL,
  'Weekly standup covering all active projects. Flagged Apex Corp risk due to Lina absence. Campaign metrics shared. Brand refresh timeline confirmed.',
  '["Rami covers Apex Corp webinar content during Lina absence","Brand refresh project officially kicks off March 1","March content calendar review meeting set for Friday"]',
  '["All: Review March content calendar by Friday","Sara: Address Apex Corp timeline concern","Nadia: Prepare brand refresh kickoff materials"]'),

('Campaign Performance Deep Dive', '2026-03-03', '10:00', 60, 'Meeting Room A', 'scheduled', 1, NULL, '[]', '[]'),

('Joint Webinar Prep - Apex Corp', '2026-03-05', '14:00', 60, 'Virtual - Zoom', 'scheduled', 3, NULL, '[]', '[]'),

('Brand Refresh Kickoff', '2026-03-04', '11:00', 90, 'Creative Studio', 'scheduled', 5, NULL, '[]', '[]'),

('Q1 Review Dry Run', '2026-03-10', '15:00', 60, 'Meeting Room A', 'scheduled', NULL, NULL, '[]', '[]'),

('Annual Report Review', '2026-03-07', '10:00', 45, 'Meeting Room B', 'scheduled', 6, NULL, '[]', '[]');

-- Meeting Attendees
-- Q1 Campaign Weekly Sync (meeting 1)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (1, 1), (1, 2), (1, 6), (1, 7), (1, 8);
-- Video Strategy Kickoff (meeting 2)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (2, 1), (2, 2), (2, 4), (2, 7);
-- Apex Corp Partnership (meeting 3)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (3, 1), (3, 3), (3, 4);
-- SEO Initiative (meeting 4)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (4, 1), (4, 5), (4, 2), (4, 8);
-- All-Hands (meeting 5)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (5, 1), (5, 2), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8);
-- Campaign Deep Dive (meeting 6)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (6, 1), (6, 6), (6, 8);
-- Apex Webinar Prep (meeting 7)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (7, 1), (7, 4), (7, 3);
-- Brand Refresh Kickoff (meeting 8)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (8, 1), (8, 7), (8, 4);
-- Q1 Review Dry Run (meeting 9)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (9, 1), (9, 2), (9, 5), (9, 6), (9, 8);
-- Annual Report Review (meeting 10)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (10, 1), (10, 8), (10, 5);

-- KPIs (28)
INSERT INTO kpis (employee_id, metric_name, target_value, current_value, unit, period, status) VALUES
-- Sara (Director)
(1, 'Team Productivity Score', 85, 82, '%', 'Q1 2026', 'on_track'),
(1, 'Budget Utilization', 100, 58, '%', 'Q1 2026', 'on_track'),
(1, 'Project On-Time Delivery', 90, 75, '%', 'Q1 2026', 'at_risk'),
(1, 'Team Satisfaction Score', 4.5, 4.2, '/5', 'Q1 2026', 'on_track'),
-- Ahmad (Content Lead)
(2, 'Content Output', 20, 14, 'pieces', 'Q1 2026', 'on_track'),
(2, 'Content Engagement Rate', 5, 4.8, '%', 'Q1 2026', 'on_track'),
(2, 'Video Content Published', 10, 0, 'videos', 'Q1 2026', 'behind'),
(2, 'Content Calendar Adherence', 95, 88, '%', 'Q1 2026', 'at_risk'),
-- Lina (Growth - absent)
(3, 'Partnership Revenue', 100000, 0, 'SAR', 'Q1 2026', 'behind'),
(3, 'New Partnerships Signed', 3, 1, 'deals', 'Q1 2026', 'behind'),
(3, 'Lead Generation', 500, 180, 'leads', 'Q1 2026', 'at_risk'),
-- Rami (Copywriter)
(4, 'Copy Deliverables', 30, 22, 'pieces', 'Q1 2026', 'on_track'),
(4, 'Copy Quality Score', 90, 92, '%', 'Q1 2026', 'exceeded'),
(4, 'Turnaround Time', 48, 36, 'hours', 'Q1 2026', 'exceeded'),
-- Dina (SEO)
(5, 'Organic Traffic Growth', 40, 28, '%', 'Q1 2026', 'on_track'),
(5, 'Keyword Rankings Top 10', 50, 35, 'keywords', 'Q1 2026', 'on_track'),
(5, 'Technical Issues Resolved', 68, 42, 'issues', 'Q1 2026', 'on_track'),
(5, 'Core Web Vitals Score', 85, 65, 'score', 'Q1 2026', 'behind'),
-- Omar (Campaigns)
(6, 'Campaign ROI', 300, 280, '%', 'Q1 2026', 'on_track'),
(6, 'Cost Per Acquisition', 45, 38, 'SAR', 'Q1 2026', 'exceeded'),
(6, 'Lead Quality (MQL Rate)', 30, 45, '%', 'Q1 2026', 'exceeded'),
(6, 'Ad Spend Efficiency', 90, 87, '%', 'Q1 2026', 'on_track'),
-- Nadia (Designer)
(7, 'Design Deliverables', 25, 16, 'pieces', 'Q1 2026', 'on_track'),
(7, 'Design Revision Rate', 15, 18, '%', 'Q1 2026', 'at_risk'),
(7, 'Brand Consistency Score', 95, 91, '%', 'Q1 2026', 'on_track'),
-- Yousef (Analyst)
(8, 'Reports Delivered', 12, 9, 'reports', 'Q1 2026', 'on_track'),
(8, 'Data Accuracy', 99, 99.2, '%', 'Q1 2026', 'exceeded'),
(8, 'Insight Action Rate', 70, 65, '%', 'Q1 2026', 'on_track');
