-- Employee X Seed Data
-- Single Department: Marketing (Saudi Arabia context)

-- Department
INSERT INTO department (name, name_ar, director, employee_x_email, color, description) VALUES
('Marketing', 'التسويق', 'Fahad Al-Otaibi', 'employeex.marketing@gmail.com', '#0EA5E9', 'قسم التسويق المسؤول عن استراتيجية العلامة التجارية والمحتوى والحملات الرقمية والشراكات وتحسين محركات البحث.');

-- Employees (8)
INSERT INTO employees (name, role, email, status, avatar, skills, capacity, join_date) VALUES
('Fahad Al-Otaibi', 'Marketing Director', 'fahad@nouratech.sa', 'active', NULL, '["Strategy","Leadership","Brand Management","Budget Planning","Team Building"]', 85, '2022-03-15'),
('Nouf Al-Dossari', 'Content Lead', 'nouf@nouratech.sa', 'active', NULL, '["Content Strategy","Copywriting","Video Production","Social Media","Analytics"]', 90, '2022-08-01'),
('Turki Al-Qahtani', 'Growth Manager', 'turki@nouratech.sa', 'absent', NULL, '["Growth Hacking","Partnerships","Data Analysis","Campaign Management","CRM"]', 0, '2023-01-10'),
('Reema Al-Harbi', 'Senior Copywriter', 'reema@nouratech.sa', 'active', NULL, '["Copywriting","Arabic Content","Brand Voice","Email Marketing","Storytelling"]', 75, '2023-04-20'),
('Sultan Al-Ghamdi', 'SEO Specialist', 'sultan@nouratech.sa', 'active', NULL, '["SEO","SEM","Google Analytics","Keyword Research","Technical SEO","Link Building"]', 95, '2023-06-15'),
('Lama Al-Shehri', 'Digital Campaign Manager', 'lama@nouratech.sa', 'active', NULL, '["PPC","Social Ads","Campaign Optimization","A/B Testing","Budget Management"]', 80, '2023-09-01'),
('Abdulaziz Al-Mutairi', 'Graphic Designer', 'abdulaziz@nouratech.sa', 'active', NULL, '["UI Design","Brand Identity","Adobe Suite","Motion Graphics","Illustration"]', 70, '2024-01-15'),
('Hessa Al-Rashidi', 'Marketing Analyst', 'hessa@nouratech.sa', 'active', NULL, '["Data Analysis","SQL","Tableau","Market Research","Reporting","Python"]', 88, '2024-03-01');

-- Projects (6)
INSERT INTO projects (name, description, status, health, priority, progress, start_date, target_date, budget, tags) VALUES
('Q1 Marketing Campaign', 'حملة تسويقية شاملة متعددة القنوات للربع الأول 2026 تستهدف استقطاب عملاء جدد وتعزيز الوعي بالعلامة التجارية عبر القنوات الرقمية والتقليدية في السوق السعودي.', 'active', 'green', 'critical', 72, '2026-01-05', '2026-03-31', '150,000 SAR', '["campaign","q1","multi-channel","acquisition"]'),
('Video-First Content Strategy', 'تحويل استراتيجية المحتوى إلى نهج الفيديو أولاً عبر يوتيوب وتيك توك وسناب شات. يشمل التعاقد مع مصورين مستقلين وبناء قدرات داخلية للإنتاج.', 'active', 'yellow', 'high', 45, '2026-01-15', '2026-04-30', '80,000 SAR', '["video","content","social-media","strategy"]'),
('Tamkeen Group Partnership', 'شراكة تسويقية استراتيجية مع مجموعة تمكين لسلسلة ندوات مشتركة وتعاون في المحتوى واتفاقية مشاركة العملاء المحتملين.', 'active', 'red', 'high', 30, '2026-02-01', '2026-03-15', '25,000 SAR', '["partnership","b2b","tamkeen","co-marketing"]'),
('SEO Optimization Initiative', 'إصلاح شامل لتحسين محركات البحث التقنية: سرعة الموقع، ترميز البيانات المنظمة، مجموعات المحتوى، وحملة بناء الروابط لتحسين الترتيب العضوي بنسبة 40%.', 'active', 'green', 'medium', 55, '2026-01-20', '2026-05-15', '35,000 SAR', '["seo","technical","organic","optimization"]'),
('Brand Refresh', 'تحديث إرشادات العلامة التجارية وتحسين الشعار ولوحة ألوان جديدة ونظام الخطوط والتطبيق عبر جميع نقاط الاتصال بما في ذلك الموقع ووسائل التواصل الاجتماعي.', 'planning', 'green', 'medium', 10, '2026-03-01', '2026-06-30', '60,000 SAR', '["brand","design","identity","refresh"]'),
('Annual Marketing Report', 'تحليل شامل لأداء التسويق لعام 2025، مقاييس العائد على الاستثمار، فعالية القنوات، والتوصيات الاستراتيجية لعام 2026.', 'active', 'yellow', 'high', 65, '2026-02-10', '2026-03-10', '5,000 SAR', '["report","analytics","annual","2025"]');

-- Project Members
-- Q1 Marketing Campaign (project 1)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(1, 1, 'lead'), (1, 2, 'member'), (1, 6, 'member'), (1, 7, 'member'), (1, 8, 'reviewer');
-- Video-First Content Strategy (project 2)
INSERT INTO project_members (project_id, employee_id, role) VALUES
(2, 2, 'lead'), (2, 4, 'member'), (2, 7, 'member');
-- Tamkeen Group Partnership (project 3)
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
(1, 6, 'Google Ads campaign setup', 'إعداد وإطلاق حملات إعلانات قوقل للربع الأول تستهدف الكلمات المفتاحية المحددة', 'in_progress', 'critical', '2026-03-05', 0),
(1, 6, 'Social media ad creatives', 'تصميم ونشر مجموعات الإعلانات لسناب شات وإنستقرام ولينكد إن وتويتر', 'completed', 'high', '2026-02-20', 0),
(1, 7, 'Campaign landing pages', 'تصميم 3 صفحات هبوط لشرائح الحملة المستهدفة', 'in_progress', 'high', '2026-03-01', 2),
(1, 2, 'Campaign email sequences', 'كتابة سلسلة بريد إلكتروني من 5 رسائل لرعاية العملاء المحتملين من الحملة', 'in_progress', 'high', '2026-03-08', 0),
(1, 8, 'Campaign analytics dashboard', 'بناء لوحة تحليلات فورية لمؤشرات أداء الحملة', 'completed', 'medium', '2026-02-25', 0),
-- Video Content
(2, 2, 'Video content calendar', 'تخطيط تقويم محتوى فيديو لمدة 30 يوم لجميع المنصات', 'in_progress', 'high', '2026-03-05', 0),
(2, 4, 'Video scripts batch 1', 'كتابة سيناريوهات أول 5 فيديوهات (شرح المنتجات)', 'in_progress', 'high', '2026-03-10', 0),
(2, 7, 'Video thumbnails & graphics', 'تصميم قوالب الصور المصغرة ومقدمات الموشن جرافيك', 'not_started', 'medium', '2026-03-15', 0),
-- Tamkeen Group
(3, 3, 'Partnership proposal deck', 'إنهاء عرض الشراكة التسويقية المشتركة مع مجموعة تمكين', 'blocked', 'critical', '2026-02-25', 4),
(3, 4, 'Joint webinar content', 'كتابة المحتوى والشرائح للندوة المشتركة مع مجموعة تمكين', 'in_progress', 'high', '2026-03-05', 0),
(3, 3, 'Lead sharing framework', 'تحديد معايير تأهيل العملاء المحتملين وآلية المشاركة', 'blocked', 'high', '2026-03-01', 0),
-- SEO
(4, 5, 'Technical SEO audit report', 'إكمال تدقيق SEO التقني مع قائمة إصلاحات مرتبة حسب الأولوية', 'completed', 'critical', '2026-02-15', 0),
(4, 5, 'Schema markup implementation', 'تنفيذ البيانات المنظمة عبر جميع الصفحات الرئيسية', 'in_progress', 'high', '2026-03-10', 0),
(4, 2, 'SEO content clusters', 'كتابة 3 مجموعات محتوى (15 مقال) تستهدف الكلمات المفتاحية ذات الأولوية', 'in_progress', 'medium', '2026-04-01', 0),
(4, 5, 'Link building outreach', '50 رسالة تواصل للمواقع المستهدفة للحصول على روابط خلفية', 'not_started', 'medium', '2026-03-20', 0),
-- Brand Refresh
(5, 7, 'Brand audit presentation', 'بحث وتقديم تحليل تصور العلامة التجارية الحالية', 'not_started', 'high', '2026-03-15', 0),
(5, 7, 'Logo refinement concepts', '3 اتجاهات لتحسين الشعار مع نماذج أولية', 'not_started', 'medium', '2026-03-25', 0),
-- Annual Report
(6, 8, 'Data analysis & charts', 'تحليل بيانات التسويق لعام 2025 وإنشاء الرسوم البيانية', 'in_progress', 'high', '2026-03-03', 0),
(6, 5, 'SEO performance section', 'كتابة قسم أداء البحث العضوي مع مقارنة سنوية', 'in_progress', 'medium', '2026-03-05', 0),
(6, 1, 'Executive summary & recommendations', 'كتابة الملخص التنفيذي والتوصيات الاستراتيجية لعام 2026', 'not_started', 'high', '2026-03-08', 0);

-- Emails (25) - All CCed to Employee X
INSERT INTO emails (from_address, to_address, cc, subject, body, date, classification, status, priority, project_id, employee_id) VALUES
('fahad@nouratech.sa', 'team@nouratech.sa', 'employeex.marketing@gmail.com', 'Q1 Campaign Launch Update', 'فريق العمل، أخبار ممتازة — حملتنا للربع الأول انطلقت في موعدها. المؤشرات الأولية مبشرة بنسبة نقر 3.2% على إعلانات قوقل. لما، الرجاء مشاركة تقرير أداء أول 48 ساعة قبل نهاية يوم غد. نوف، تأكدي أن سلاسل البريد الإلكتروني جاهزة ومختبرة.', '2026-02-21 09:15:00', 'update', 'read', 'normal', 1, 1),
('lama@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'RE: Q1 Campaign - 48hr Performance', 'فهد، هذي الأرقام: نسبة نقر قوقل 3.2%، إعلانات التواصل الاجتماعي 2.8%، تحويل صفحات الهبوط 4.1%. صرف الميزانية ماشي حسب الخطة عند 18%. أقترح زيادة ميزانية لينكد إن 15% بناءً على جودة العملاء المحتملين الأعلى. العرض المفصل مرفق.', '2026-02-22 14:30:00', 'update', 'read', 'normal', 1, 6),
('turki@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Tamkeen Group - Partnership Delay', 'فهد، أبغى أنبه إن عرض شراكة مجموعة تمكين متأخر. كان المفروض أنهيه هالأسبوع لكن غيابي يعني بيتأخر. مدير التسويق عندهم يتوقع العرض قبل 1 مارس. أحد يقدر يكمل؟ الملفات في المجلد المشترك تحت /Partnerships/Tamkeen/', '2026-02-24 11:00:00', 'escalation', 'flagged', 'urgent', 3, 3),
('cmo@tamkeengroup.sa', 'turki@nouratech.sa', 'fahad@nouratech.sa,employeex.marketing@gmail.com', 'RE: Partnership Proposal - Following Up', 'أهلاً تركي، ما وصلنا عرض الشراكة التسويقية بعد. اجتماع مجلس الإدارة عندنا يوم 8 مارس ولازم نراجعه قبلها. تقدر تأكد التسليم قبل 3 مارس؟ شكراً، خالد المنصور، مدير التسويق - مجموعة تمكين', '2026-02-26 16:45:00', 'action_required', 'flagged', 'urgent', 3, 3),
('nouf@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Video Strategy - Production Pipeline Issue', 'فهد، واجهنا مشكلة في خط إنتاج الفيديو. المصور المستقل اللي اخترناه انسحب. عندي خيارين بديلين لكن كلهم أغلى (15-20% فوق الميزانية). أحتاج موافقتك نكمل. وبعد، مسودة تقويم محتوى الفيديو جاهزة للمراجعة.', '2026-02-25 10:20:00', 'action_required', 'read', 'high', 2, 2),
('sultan@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'SEO Audit Complete - Quick Wins Identified', 'فهد، تدقيق SEO التقني خلص. لقينا 23 مشكلة حرجة و45 متوسطة. أهم 3 مكاسب سريعة: 1) إصلاح أخطاء 404 (تقدير +8% زيارات عضوية)، 2) إضافة ترميز البيانات المنظمة لصفحات المنتجات، 3) تحسين مؤشرات الويب الأساسية. بنبدأ الإصلاحات هالأسبوع. التقرير الكامل مرفق.', '2026-02-16 09:00:00', 'update', 'read', 'normal', 4, 5),
('fahad@nouratech.sa', 'sultan@nouratech.sa', 'employeex.marketing@gmail.com', 'RE: SEO Audit - Approved to Proceed', 'شغل ممتاز سلطان. موافق نكمل بجميع الإصلاحات. ابدأ بأخطاء 404 والبيانات المنظمة أولاً. بلغني إذا تحتاج دعم فريق التطوير لمؤشرات الويب الأساسية.', '2026-02-16 11:30:00', 'update', 'read', 'normal', 4, 1),
('reema@nouratech.sa', 'nouf@nouratech.sa', 'employeex.marketing@gmail.com', 'Video Scripts - First Draft', 'نوف، أول سيناريوهين جاهزين للمراجعة. استخدمت أسلوب محادثة زي ما اتفقنا. كل فيديو تقريباً 3 دقائق. السيناريوهات في المستند المشترك. بلغيني إذا الأسلوب مناسب قبل ما أكمل الباقي.', '2026-02-27 13:15:00', 'update', 'read', 'normal', 2, 4),
('hessa@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Campaign Analytics Dashboard Ready', 'فهد، لوحة التحليلات الفورية شغالة. المؤشرات المتابعة: نسبة النقر، تكلفة النقرة، معدل التحويل، جودة العملاء المحتملين، عائد القناة. أشارك الرابط. ملاحظة مهمة: لينكد إن يتفوق على توقعاتنا بـ 22%.', '2026-02-24 16:00:00', 'update', 'read', 'normal', 1, 8),
('abdulaziz@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Landing Page Designs - Review Needed', 'فهد، خلصت تصاميم صفحات الهبوط الثلاث لشرائح الحملة. موجودة في فيقما. صفحة شريحة الشركات ممكن تحتاج تعديل في النصوص — ريما، تقدرين تراجعين العنوان؟ تأخير بسيط (يومين) بسبب تعديلات تصميم في اللحظة الأخيرة من فريق العلامة التجارية.', '2026-02-28 10:00:00', 'action_required', 'unread', 'high', 1, 7),
('fahad@nouratech.sa', 'team@nouratech.sa', 'employeex.marketing@gmail.com', 'Turki Absence - Coverage Plan', 'فريق العمل، زي ما تعرفون تركي في إجازة لين 2 مارس. ريما بتغطي محتوى ندوة تمكين. بالنسبة لعرض الشراكة، بنسق مباشرة مع مجموعة تمكين نكسب وقت. الرجاء التنبيه على أي مهام كانت معتمدة على تركي.', '2026-02-25 08:00:00', 'update', 'read', 'high', 3, 1),
('hr@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Annual Performance Reviews Reminder', 'أهلاً فهد، تذكير بأن تقييمات الأداء السنوية لفريقك مستحقة يوم 15 مارس. الرجاء جدولة اجتماعات فردية مع كل عضو في الفريق وتقديم التقييمات عبر بوابة الموارد البشرية. بلغنا إذا تحتاج نموذج التقييم المحدث.', '2026-02-20 09:00:00', 'action_required', 'read', 'high', NULL, 1),
('lama@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Campaign Budget Alert - LinkedIn Overspend', 'فهد، تنبيه — صرف إعلانات لينكد إن يتجاوز الميزانية المخصصة بـ 12% لهالأسبوع. جودة العملاء ممتازة (45% معدل تأهيل مقابل هدف 30%) فأعتقد يستاهل، لكن أحتاج موافقتك نحول من ميزانية تويتر اللي أداؤها أقل.', '2026-02-27 11:30:00', 'action_required', 'unread', 'high', 1, 6),
('vendor@riyadhprint.sa', 'abdulaziz@nouratech.sa', 'employeex.marketing@gmail.com', 'Brand Refresh Materials - Print Quote', 'أهلاً عبدالعزيز، حسب نقاشنا، هذا عرض سعر مواد تجديد العلامة التجارية المطبوعة: كروت عمل (500 مجموعة): 2,500 ريال، أوراق رسمية (1000): 1,800 ريال، بروشورات (500): 4,200 ريال. خصم 15% إذا طلبتها مع بعض. العرض ساري لين 15 مارس.', '2026-02-26 14:00:00', 'fyi', 'read', 'normal', 5, 7),
('nouf@nouratech.sa', 'team@nouratech.sa', 'employeex.marketing@gmail.com', 'Content Calendar - March Planning', 'فريق العمل، أشارك تقويم محتوى مارس. أهم النقاط: 12 مقال، 8 فيديوهات (بانتظار خط الإنتاج)، 20 منشور تواصل اجتماعي، 3 حملات بريد إلكتروني، ندوة واحدة مع مجموعة تمكين. الرجاء مراجعة المهام المسندة إليكم والتنبيه على أي تعارض قبل يوم الجمعة.', '2026-02-28 09:00:00', 'action_required', 'unread', 'normal', NULL, 2),
('sultan@nouratech.sa', 'nouf@nouratech.sa', 'employeex.marketing@gmail.com', 'SEO Content Brief - Cluster 1', 'نوف، هذي ملخصات المحتوى لأول مجموعة SEO (5 مقالات). الكلمات المفتاحية المستهدفة وعدد الكلمات وتحليل المنافسين مرفقة. الكلمات المفتاحية ذات الأولوية حجم بحثها 5 آلاف - 15 ألف شهرياً. بلغيني إذا صيغة الملخص مناسبة للكتاب.', '2026-02-27 10:00:00', 'update', 'read', 'normal', 4, 5),
('hessa@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Monthly Marketing Report Draft', 'فهد، مسودة قسم البيانات في التقرير السنوي جاهزة. أهم النتائج: إجمالي العملاء المحتملين لعام 2025 ارتفع 34% سنوياً، تكلفة اكتساب العميل انخفضت 12%، أفضل قناة أداءً كانت البحث العضوي (+45%). أحتاج ملخصك التنفيذي وتوصيات 2026 لإنهاء التقرير. الهدف الانتهاء قبل 10 مارس.', '2026-02-28 15:00:00', 'action_required', 'unread', 'high', 6, 8),
('fahad@nouratech.sa', 'team@nouratech.sa', 'employeex.marketing@gmail.com', 'Team Meeting - Q1 Review Prep', 'فريق العمل، عندنا اجتماع مراجعة الربع الأول مع الإدارة يوم 12 مارس. كل قائد مشروع يجهز عرض 5 دقائق: الحالة، أهم الإنجازات، العوائق، والخطوات القادمة. بنسوي بروفة يوم 10 مارس. حصة، جهزي عرض المؤشرات الموحد.', '2026-02-28 16:30:00', 'action_required', 'unread', 'normal', NULL, 1),
('reema@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Tamkeen Webinar Content - Draft', 'فهد، جهزت مخطط محتوى ندوة مجموعة تمكين المشتركة. الموضوع: "تسويق النمو في 2026 - استراتيجيات B2B الناجحة". صيغة 45 دقيقة مع أسئلة وأجوبة. أحتاج تركي يراجع رسائل الشراكة لما يرجع. مسودة الشرائح في المجلد المشترك.', '2026-02-28 14:00:00', 'update', 'read', 'normal', 3, 4),
('finance@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Q1 Budget Utilization Check', 'أهلاً فهد، حتى تاريخ 28 فبراير، قسمك استخدم 58% من ميزانية الربع الأول. أنتم على المسار الصحيح. ملاحظة: الموعد النهائي لميزانية مارس — أي مبالغ غير مستخدمة من الربع الأول لا يمكن ترحيلها. بلغنا إذا تتوقع أي تعديلات على الميزانية.', '2026-02-28 12:00:00', 'fyi', 'read', 'normal', NULL, NULL),
('lama@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'A/B Test Results - Campaign Landing Pages', 'فهد، نتائج اختبار A/B لصفحات هبوط الحملة: النسخة B (عنوان فيديو) تتفوق على النسخة A بـ 28% في معدل التحويل. أقترح تطبيق النسخة B على جميع الشرائح. وبعد، نسخة الجوال تحتاج عبدالعزيز يصلح مشكلة في التخطيط.', '2026-02-27 16:00:00', 'update', 'read', 'normal', 1, 6),
('abdulaziz@nouratech.sa', 'nouf@nouratech.sa', 'employeex.marketing@gmail.com', 'Video Thumbnail Templates Done', 'نوف، قوالب الصور المصغرة للفيديو جاهزة — 5 نسخ متوافقة مع هوية العلامة التجارية. وبعد سويت مقدمة وخاتمة متحركة (10 ثواني كل وحدة). الملفات في مجلد أصول العلامة التجارية. جاهزة متى ما اتصورت الفيديوهات.', '2026-02-26 11:00:00', 'update', 'read', 'normal', 2, 7),
('sultan@nouratech.sa', 'fahad@nouratech.sa', 'employeex.marketing@gmail.com', 'Core Web Vitals - Dev Team Needed', 'فهد، سويت كل اللي أقدر عليه من جهة SEO لمؤشرات الويب الأساسية لكن أحتاج فريق التطوير لـ 3 أشياء: تحميل الصور الكسول، تقسيم حزم JavaScript، والتخزين المؤقت من جهة السيرفر. تقدر تطلب دعم التطوير؟ هذا ممكن يحسن درجاتنا من 65 إلى 85+.', '2026-02-28 11:00:00', 'request', 'unread', 'normal', 4, 5),
('fahad@nouratech.sa', 'finance@nouratech.sa', 'employeex.marketing@gmail.com', 'RE: Budget - LinkedIn Reallocation Request', 'أهلاً المالية، أطلب موافقة لتحويل 8,000 ريال من ميزانية إعلانات تويتر إلى لينكد إن. تويتر أداؤه ضعيف (0.8% نسبة نقر) بينما لينكد إن يتجاوز الأهداف (4.2% نسبة نقر، 45% معدل تأهيل). هذا ضمن مخصصات الربع الأول.', '2026-02-28 10:00:00', 'request', 'read', 'normal', 1, 1),
('nouf@nouratech.sa', 'reema@nouratech.sa', 'employeex.marketing@gmail.com', 'RE: Video Scripts - Feedback', 'ريما، شغل ممتاز على السيناريوهات! الأسلوب مضبوط. ملاحظتين بسيطة: 1) أضيفي دعوة لاتخاذ إجراء عند الدقيقة الثانية في السيناريو الأول، 2) السيناريو الثاني يحتاج مقدمة أقوى في أول 10 ثواني. كملي الثلاث الباقية. الهدف: الخمسة جاهزين قبل 10 مارس.', '2026-02-27 15:30:00', 'update', 'read', 'normal', 2, 2);

-- Meetings (10)
INSERT INTO meetings (title, date, time, duration_minutes, location, status, project_id, summary, decisions, action_items) VALUES
('Q1 Campaign Weekly Sync', '2026-02-24', '10:00', 60, 'قاعة الاجتماعات أ - الرياض', 'completed', 1,
  'مراجعة أداء الحملة بعد الأسبوع الأول. إعلانات قوقل أداؤها فوق المستهدف، إعلانات التواصل الاجتماعي تحتاج تحسين. تتبع تحويلات صفحات الهبوط شغال.',
  '["زيادة ميزانية لينكد إن 15% من مخصصات تويتر","إطلاق حملة إعادة استهداف قبل 28 فبراير","الإبقاء على استراتيجية مزايدة قوقل بدون تغيير"]',
  '["لما: تجهيز مقترح إعادة توزيع الميزانية قبل 27 فبراير","نوف: إطلاق سلسلة البريد الإلكتروني #2 قبل 26 فبراير","حصة: إعداد تقرير أسبوعي آلي قبل 28 فبراير"]'),

('Video Strategy Kickoff', '2026-02-18', '14:00', 90, 'استوديو الإبداع - الرياض', 'completed', 2,
  'توحيد الرؤية حول استراتيجية الفيديو أولاً. قرار باتباع نهج 3 منصات. نقاش حول سير عمل الإنتاج والموارد المطلوبة.',
  '["التركيز على يوتيوب شورتس + تيك توك + سناب شات","التعاقد مع مصور مستقل (الميزانية معتمدة)","نوف تقود تقويم المحتوى، ريما تكتب السيناريوهات"]',
  '["نوف: إكمال تقويم محتوى الفيديو قبل 5 مارس","ريما: أول دفعة 5 سيناريوهات قبل 10 مارس","عبدالعزيز: تصميم قوالب الصور المصغرة قبل 26 فبراير"]'),

('Tamkeen Group Partnership Planning', '2026-02-15', '11:00', 60, 'اجتماع افتراضي - زوم', 'completed', 3,
  'اجتمعنا مع مدير تسويق مجموعة تمكين لمناقشة هيكل الشراكة. اتفقنا على سلسلة ندوات مشتركة وتعاون في المحتوى. شروط مشاركة العملاء المحتملين تحتاج مراجعة قانونية.',
  '["سلسلة 3 ندوات تبدأ مارس 2026","مكتبة محتوى مشتركة للعلامتين","مشاركة العملاء المحتملين مع فترة حصرية 30 يوم"]',
  '["تركي: إنهاء عرض الشراكة قبل 25 فبراير","ريما: مسودة محتوى الندوة الأولى قبل 5 مارس","فهد: جدولة المراجعة القانونية لاتفاقية مشاركة العملاء"]'),

('SEO Initiative Progress Review', '2026-02-20', '09:00', 45, 'قاعة الاجتماعات ب - الرياض', 'completed', 4,
  'مراجعة نتائج تدقيق SEO التقني. تحديد 23 مشكلة حرجة. ترتيب المكاسب السريعة للتنفيذ الفوري. الحاجة لدعم فريق التطوير لمؤشرات الويب الأساسية.',
  '["أولوية إصلاح 404 والبيانات المنظمة","طلب دعم فريق التطوير لمؤشرات الويب الأساسية","مجموعات المحتوى تستهدف 15 كلمة مفتاحية ذات أولوية"]',
  '["سلطان: البدء بإصلاح أخطاء 404 فوراً","سلطان: تقديم طلب دعم التطوير لمؤشرات الويب","نوف: البدء بكتابة مجموعات المحتوى قبل 1 مارس"]'),

('All-Hands Marketing Standup', '2026-02-27', '09:00', 30, 'المساحة المفتوحة - الرياض', 'completed', NULL,
  'اجتماع أسبوعي يغطي جميع المشاريع النشطة. تنبيه على خطر تمكين بسبب غياب تركي. مشاركة مؤشرات الحملة. تأكيد جدول تجديد العلامة التجارية.',
  '["ريما تغطي محتوى ندوة تمكين أثناء غياب تركي","مشروع تجديد العلامة التجارية ينطلق رسمياً 1 مارس","اجتماع مراجعة تقويم مارس يوم الجمعة"]',
  '["الجميع: مراجعة تقويم محتوى مارس قبل الجمعة","فهد: معالجة قلق جدول تمكين","عبدالعزيز: تجهيز مواد انطلاق تجديد العلامة التجارية"]'),

('Campaign Performance Deep Dive', '2026-03-03', '10:00', 60, 'قاعة الاجتماعات أ - الرياض', 'scheduled', 1, NULL, '[]', '[]'),

('Joint Webinar Prep - Tamkeen', '2026-03-05', '14:00', 60, 'اجتماع افتراضي - زوم', 'scheduled', 3, NULL, '[]', '[]'),

('Brand Refresh Kickoff', '2026-03-04', '11:00', 90, 'استوديو الإبداع - الرياض', 'scheduled', 5, NULL, '[]', '[]'),

('Q1 Review Dry Run', '2026-03-10', '15:00', 60, 'قاعة الاجتماعات أ - الرياض', 'scheduled', NULL, NULL, '[]', '[]'),

('Annual Report Review', '2026-03-07', '10:00', 45, 'قاعة الاجتماعات ب - الرياض', 'scheduled', 6, NULL, '[]', '[]');

-- Meeting Attendees
-- Q1 Campaign Weekly Sync (meeting 1)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (1, 1), (1, 2), (1, 6), (1, 7), (1, 8);
-- Video Strategy Kickoff (meeting 2)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (2, 1), (2, 2), (2, 4), (2, 7);
-- Tamkeen Group Partnership (meeting 3)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (3, 1), (3, 3), (3, 4);
-- SEO Initiative (meeting 4)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (4, 1), (4, 5), (4, 2), (4, 8);
-- All-Hands (meeting 5)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (5, 1), (5, 2), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8);
-- Campaign Deep Dive (meeting 6)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (6, 1), (6, 6), (6, 8);
-- Tamkeen Webinar Prep (meeting 7)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (7, 1), (7, 4), (7, 3);
-- Brand Refresh Kickoff (meeting 8)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (8, 1), (8, 7), (8, 4);
-- Q1 Review Dry Run (meeting 9)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (9, 1), (9, 2), (9, 5), (9, 6), (9, 8);
-- Annual Report Review (meeting 10)
INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (10, 1), (10, 8), (10, 5);

-- KPIs (28)
INSERT INTO kpis (employee_id, metric_name, target_value, current_value, unit, period, status) VALUES
-- Fahad (Director)
(1, 'Team Productivity Score', 85, 82, '%', 'Q1 2026', 'on_track'),
(1, 'Budget Utilization', 100, 58, '%', 'Q1 2026', 'on_track'),
(1, 'Project On-Time Delivery', 90, 75, '%', 'Q1 2026', 'at_risk'),
(1, 'Team Satisfaction Score', 4.5, 4.2, '/5', 'Q1 2026', 'on_track'),
-- Nouf (Content Lead)
(2, 'Content Output', 20, 14, 'pieces', 'Q1 2026', 'on_track'),
(2, 'Content Engagement Rate', 5, 4.8, '%', 'Q1 2026', 'on_track'),
(2, 'Video Content Published', 10, 0, 'videos', 'Q1 2026', 'behind'),
(2, 'Content Calendar Adherence', 95, 88, '%', 'Q1 2026', 'at_risk'),
-- Turki (Growth - absent)
(3, 'Partnership Revenue', 100000, 0, 'SAR', 'Q1 2026', 'behind'),
(3, 'New Partnerships Signed', 3, 1, 'deals', 'Q1 2026', 'behind'),
(3, 'Lead Generation', 500, 180, 'leads', 'Q1 2026', 'at_risk'),
-- Reema (Copywriter)
(4, 'Copy Deliverables', 30, 22, 'pieces', 'Q1 2026', 'on_track'),
(4, 'Copy Quality Score', 90, 92, '%', 'Q1 2026', 'exceeded'),
(4, 'Turnaround Time', 48, 36, 'hours', 'Q1 2026', 'exceeded'),
-- Sultan (SEO)
(5, 'Organic Traffic Growth', 40, 28, '%', 'Q1 2026', 'on_track'),
(5, 'Keyword Rankings Top 10', 50, 35, 'keywords', 'Q1 2026', 'on_track'),
(5, 'Technical Issues Resolved', 68, 42, 'issues', 'Q1 2026', 'on_track'),
(5, 'Core Web Vitals Score', 85, 65, 'score', 'Q1 2026', 'behind'),
-- Lama (Campaigns)
(6, 'Campaign ROI', 300, 280, '%', 'Q1 2026', 'on_track'),
(6, 'Cost Per Acquisition', 45, 38, 'SAR', 'Q1 2026', 'exceeded'),
(6, 'Lead Quality (MQL Rate)', 30, 45, '%', 'Q1 2026', 'exceeded'),
(6, 'Ad Spend Efficiency', 90, 87, '%', 'Q1 2026', 'on_track'),
-- Abdulaziz (Designer)
(7, 'Design Deliverables', 25, 16, 'pieces', 'Q1 2026', 'on_track'),
(7, 'Design Revision Rate', 15, 18, '%', 'Q1 2026', 'at_risk'),
(7, 'Brand Consistency Score', 95, 91, '%', 'Q1 2026', 'on_track'),
-- Hessa (Analyst)
(8, 'Reports Delivered', 12, 9, 'reports', 'Q1 2026', 'on_track'),
(8, 'Data Accuracy', 99, 99.2, '%', 'Q1 2026', 'exceeded'),
(8, 'Insight Action Rate', 70, 65, '%', 'Q1 2026', 'on_track');
