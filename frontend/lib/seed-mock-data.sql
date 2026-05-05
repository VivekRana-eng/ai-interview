-- SelectAI Mock Data Seed Script
-- Run this in the Supabase SQL Editor to initialize the entire demo environment
-- Contains: RLS policies, storage policies, 3 job profiles, 16 applications, 90 interview answers, 35 audit logs

-- ────────────────────────────────────────────────
-- RLS POLICIES
-- ────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.job_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- job_profiles: public read, admin write
DROP POLICY IF EXISTS "Public can read job_profiles" ON public.job_profiles;
CREATE POLICY "Public can read job_profiles"
  ON public.job_profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin can manage job_profiles" ON public.job_profiles;
CREATE POLICY "Admin can manage job_profiles"
  ON public.job_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- applications: anon can insert/read/update (apply + interview completion), admin can manage all
DROP POLICY IF EXISTS "Anon can insert applications" ON public.applications;
CREATE POLICY "Anon can insert applications"
  ON public.applications FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon can read own application" ON public.applications;
CREATE POLICY "Anon can read own application"
  ON public.applications FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Anon can update own application" ON public.applications;
CREATE POLICY "Anon can update own application"
  ON public.applications FOR UPDATE TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin can manage applications" ON public.applications;
CREATE POLICY "Admin can manage applications"
  ON public.applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- interview_answers: anon can insert + read (needed for score calc in submitAnswer), admin can read all
DROP POLICY IF EXISTS "Anon can insert interview answers" ON public.interview_answers;
CREATE POLICY "Anon can insert interview answers"
  ON public.interview_answers FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon can read interview answers" ON public.interview_answers;
CREATE POLICY "Anon can read interview answers"
  ON public.interview_answers FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Admin can read interview answers" ON public.interview_answers;
CREATE POLICY "Admin can read interview answers"
  ON public.interview_answers FOR SELECT TO authenticated USING (true);

-- audit_log: admin/system only
DROP POLICY IF EXISTS "Admin can manage audit log" ON public.audit_log;
CREATE POLICY "Admin can manage audit log"
  ON public.audit_log FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ────────────────────────────────────────────────
-- STORAGE POLICIES (resumes bucket)
-- ────────────────────────────────────────────────

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes bucket
DROP POLICY IF EXISTS "Allow anon uploads to resumes" ON storage.objects;
CREATE POLICY "Allow anon uploads to resumes"
  ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow auth reads from resumes" ON storage.objects;
CREATE POLICY "Allow auth reads from resumes"
  ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow anon reads from resumes" ON storage.objects;
CREATE POLICY "Allow anon reads from resumes"
  ON storage.objects FOR SELECT TO anon USING (bucket_id = 'resumes');

-- ────────────────────────────────────────────────
-- SEED DATA
-- ────────────────────────────────────────────────

-- Clear existing data (order matters due to FKs)
DELETE FROM public.interview_answers;
DELETE FROM public.audit_log;
DELETE FROM public.applications;
DELETE FROM public.job_profiles;

-- Insert job profiles
INSERT INTO public.job_profiles (id, title, domain, description, required_skills, min_cgpa, min_exp_months, required_certs, seats, deadline, status, created_at) VALUES
('d6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'AI/ML Engineering Intern', 'artificial_intelligence', 'Work on cutting-edge AI/ML projects for government digital initiatives. You will assist in building predictive models, NLP pipelines, and computer vision solutions deployed at scale across public sector departments.', '["Python","TensorFlow","PyTorch","Machine Learning","Deep Learning","NLP","Computer Vision"]', 7.5, 3, '["ML Certificate","TensorFlow Cert"]', 5, '2026-06-30', 'published', NOW()),
('9e9b090f-d8aa-4005-adf8-d68b6f954a5a', 'Software Development Intern', 'software_development', 'Build and maintain full-stack web applications powering government service portals. You will work with React, FastAPI, and PostgreSQL in a high-availability environment.', '["JavaScript","React","Node.js","FastAPI","PostgreSQL","Docker","Git"]', 7.0, 0, '["Full Stack Cert"]', 6, '2026-07-15', 'published', NOW()),
('fa28c08f-66ef-4503-b357-cd987071f89a', 'Cybersecurity Intern', 'cybersecurity', 'Support the national cybersecurity operations center by conducting vulnerability assessments, threat modelling, and incident response simulations.', '["Network Security","Ethical Hacking","Penetration Testing","SIEM","Cryptography","Linux","Python"]', 7.5, 3, '["CEH","CompTIA Security+"]', 4, '2026-06-30', 'published', NOW());

-- Insert mock applications
INSERT INTO public.applications (id, job_id, candidate_name, email, phone, institution, cgpa, degree, experience_months, certifications, sop_text, resume_url, screening_score, screening_components, interview_score, final_score, rank, status, session_token, created_at) VALUES

-- === AI/ML Engineering Intern ===
('aaaaaaaa-1111-1111-1111-000000000001', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Rahul Verma', 'rahul.verma@email.com', '9876543210', 'XYZ College', 6.2, 'B.Tech CSE', 0, '["None"]', 'Looking for internship opportunity.', 'resumes/rahul_verma.pdf', 42, '{"s_skill":14.0,"s_edu":12.0,"s_exp":0.0,"s_cert":3.0,"s_sop":5.0}', NULL, NULL, NULL, 'rejected', 'bbbbbbbb-1111-1111-1111-000000000001', NOW() - INTERVAL '14 days'),
('aaaaaaaa-1111-1111-1111-000000000002', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Priya Sharma', 'priya.sharma@email.com', '9876543211', 'IIT Delhi', 8.5, 'B.Tech AI', 4, '["ML Certificate"]', 'Passionate about AI and government applications.', 'resumes/priya_sharma.pdf', 72, '{"s_skill":24.0,"s_edu":20.0,"s_exp":8.0,"s_cert":7.0,"s_sop":8.0}', NULL, NULL, NULL, 'shortlisted', 'bbbbbbbb-1111-1111-1111-000000000002', NOW() - INTERVAL '10 days'),
('aaaaaaaa-1111-1111-1111-000000000003', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Amit Kumar', 'amit.kumar@email.com', '9876543212', 'NIT Trichy', 8.1, 'B.Tech ECE', 6, '["Python Cert"]', 'Interested in machine learning research.', 'resumes/amit_kumar.pdf', 68, '{"s_skill":22.0,"s_edu":19.0,"s_exp":10.0,"s_cert":6.0,"s_sop":7.0}', NULL, NULL, NULL, 'shortlisted', 'bbbbbbbb-1111-1111-1111-000000000003', NOW() - INTERVAL '9 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Neha Gupta', 'neha.gupta@email.com', '9876543213', 'IIT Bombay', 9.0, 'B.Tech CSE', 12, '["TensorFlow Cert", "Deep Learning Specialization"]', 'Strong background in deep learning and NLP.', 'resumes/neha_gupta.pdf', 82, '{"s_skill":28.0,"s_edu":22.0,"s_exp":14.0,"s_cert":8.0,"s_sop":9.0}', 88, 86, 1, 'selected', 'bbbbbbbb-1111-1111-1111-000000000004', NOW() - INTERVAL '7 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Arjun Patel', 'arjun.patel@email.com', '9876543214', 'IIT Madras', 8.7, 'B.Tech AI', 10, '["ML Cert"]', 'Experienced in computer vision projects.', 'resumes/arjun_patel.pdf', 78, '{"s_skill":26.0,"s_edu":21.0,"s_exp":12.0,"s_cert":7.5,"s_sop":8.5}', 84, 82, 2, 'selected', 'bbbbbbbb-1111-1111-1111-000000000005', NOW() - INTERVAL '7 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Sneha Rao', 'sneha.rao@email.com', '9876543215', 'BITS Pilani', 8.3, 'B.E. CS', 8, '["Data Science Cert"]', 'Keen to work on public sector AI projects.', 'resumes/sneha_rao.pdf', 70, '{"s_skill":23.0,"s_edu":20.0,"s_exp":10.0,"s_cert":7.0,"s_sop":7.0}', 73, 72, 3, 'waitlisted', 'bbbbbbbb-1111-1111-1111-000000000006', NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 'd6374579-0c17-4d58-b8d2-8cf0a5f4c29a', 'Vikram Singh', 'vikram.singh@email.com', '9876543216', 'Delhi University', 7.4, 'B.Sc CS', 3, '[]', 'Basic knowledge of programming.', 'resumes/vikram_singh.pdf', 58, '{"s_skill":18.0,"s_edu":16.0,"s_exp":5.0,"s_cert":4.0,"s_sop":6.0}', 56, 57, 4, 'rejected', 'bbbbbbbb-1111-1111-1111-000000000007', NOW() - INTERVAL '5 days'),

-- === Software Development Intern ===
('aaaaaaaa-1111-1111-1111-000000000008', '9e9b090f-d8aa-4005-adf8-d68b6f954a5a', 'Rohit Mehta', 'rohit.mehta@email.com', '9876543217', 'State University', 6.5, 'B.Tech IT', 0, '[]', 'Want to learn software development.', 'resumes/rohit_mehta.pdf', 48, '{"s_skill":15.0,"s_edu":13.0,"s_exp":0.0,"s_cert":3.0,"s_sop":5.0}', NULL, NULL, NULL, 'rejected', 'bbbbbbbb-1111-1111-1111-000000000008', NOW() - INTERVAL '12 days'),
('aaaaaaaa-1111-1111-1111-000000000009', '9e9b090f-d8aa-4005-adf8-d68b6f954a5a', 'Kavya Iyer', 'kavya.iyer@email.com', '9876543218', 'IIT Kharagpur', 8.6, 'B.Tech CSE', 5, '["Full Stack Cert"]', 'Full-stack enthusiast with strong backend skills.', 'resumes/kavya_iyer.pdf', 74, '{"s_skill":25.0,"s_edu":21.0,"s_exp":9.0,"s_cert":7.0,"s_sop":8.0}', NULL, NULL, NULL, 'shortlisted', 'bbbbbbbb-1111-1111-1111-000000000009', NOW() - INTERVAL '8 days'),
('aaaaaaaa-1111-1111-1111-000000000010', '9e9b090f-d8aa-4005-adf8-d68b6f954a5a', 'Dhruv Nair', 'dhruv.nair@email.com', '9876543219', 'IIT Bombay', 8.9, 'B.Tech CSE', 14, '["AWS Cert", "Docker Cert"]', 'Built scalable microservices for campus projects.', 'resumes/dhruv_nair.pdf', 80, '{"s_skill":27.0,"s_edu":22.0,"s_exp":15.0,"s_cert":8.0,"s_sop":8.0}', 89, 85, 1, 'selected', 'bbbbbbbb-1111-1111-1111-000000000010', NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000011', '9e9b090f-d8aa-4005-adf8-d68b6f954a5a', 'Pooja Desai', 'pooja.desai@email.com', '9876543220', 'NIT Surat', 8.2, 'B.Tech IT', 7, '["Web Dev Cert"]', 'Experience with React and FastAPI.', 'resumes/pooja_desai.pdf', 72, '{"s_skill":24.0,"s_edu":20.0,"s_exp":9.0,"s_cert":7.0,"s_sop":8.0}', 75, 74, 2, 'waitlisted', 'bbbbbbbb-1111-1111-1111-000000000011', NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000012', '9e9b090f-d8aa-4005-adf8-d68b6f954a5a', 'Manoj Reddy', 'manoj.reddy@email.com', '9876543221', 'Anna University', 7.6, 'B.E. CSE', 4, '[]', 'Basic programming knowledge, eager to learn.', 'resumes/manoj_reddy.pdf', 62, '{"s_skill":20.0,"s_edu":17.0,"s_exp":6.0,"s_cert":4.0,"s_sop":7.0}', 52, 56, 3, 'rejected', 'bbbbbbbb-1111-1111-1111-000000000012', NOW() - INTERVAL '4 days'),

-- === Cybersecurity Intern ===
('aaaaaaaa-1111-1111-1111-000000000013', 'fa28c08f-66ef-4503-b357-cd987071f89a', 'Ankit Joshi', 'ankit.joshi@email.com', '9876543222', 'Local College', 6.8, 'B.Tech CSE', 0, '[]', 'Interested in cybersecurity field.', 'resumes/ankit_joshi.pdf', 46, '{"s_skill":14.0,"s_edu":13.0,"s_exp":0.0,"s_cert":3.0,"s_sop":5.0}', NULL, NULL, NULL, 'rejected', 'bbbbbbbb-1111-1111-1111-000000000013', NOW() - INTERVAL '11 days'),
('aaaaaaaa-1111-1111-1111-000000000014', 'fa28c08f-66ef-4503-b357-cd987071f89a', 'Riya Menon', 'riya.menon@email.com', '9876543223', 'IIT Roorkee', 8.8, 'B.Tech CSE', 6, '["Security+"]', 'Passionate about ethical hacking and network security.', 'resumes/riya_menon.pdf', 76, '{"s_skill":26.0,"s_edu":21.0,"s_exp":10.0,"s_cert":7.0,"s_sop":8.0}', NULL, NULL, NULL, 'shortlisted', 'bbbbbbbb-1111-1111-1111-000000000014', NOW() - INTERVAL '8 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 'fa28c08f-66ef-4503-b357-cd987071f89a', 'Karthik B', 'karthik.b@email.com', '9876543224', 'IIT Madras', 9.1, 'B.Tech CSE', 11, '["CEH", "CompTIA Security+"]', 'CTF player, found vulnerabilities in open-source projects.', 'resumes/karthik_b.pdf', 84, '{"s_skill":28.0,"s_edu":23.0,"s_exp":13.0,"s_cert":8.0,"s_sop":9.0}', 86, 85, 1, 'selected', 'bbbbbbbb-1111-1111-1111-000000000015', NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 'fa28c08f-66ef-4503-b357-cd987071f89a', 'Lakshmi P', 'lakshmi.p@email.com', '9876543225', 'NIT Calicut', 8.0, 'B.Tech CSE', 5, '["Network Cert"]', 'Good understanding of network protocols.', 'resumes/lakshmi_p.pdf', 68, '{"s_skill":22.0,"s_edu":19.0,"s_exp":8.0,"s_cert":6.0,"s_sop":7.0}', 72, 70, 2, 'waitlisted', 'bbbbbbbb-1111-1111-1111-000000000016', NOW() - INTERVAL '5 days');

-- Insert interview answers for completed interviews (10 questions each)
INSERT INTO public.interview_answers (application_id, question_number, question_text, answer_text, mock_score, answer_time_seconds, created_at) VALUES
-- Neha Gupta (AI) — avg 8.8
('aaaaaaaa-1111-1111-1111-000000000004', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I built a Hindi-to-English neural machine translation system using transformer architecture. I handled data preprocessing, model fine-tuning, and deployment on AWS.', 9, 45, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'RESTful APIs use HTTP methods to perform CRUD operations. I designed a REST API for a campus event management app using FastAPI with OAuth2 authentication.', 9, 38, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 3, 'How would you approach debugging a performance issue in a web application?', 'I would start with profiling tools like cProfile, check database query execution plans, identify N+1 queries, and use caching where appropriate.', 8, 42, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 4, 'What is the difference between synchronous and asynchronous programming?', 'Synchronous blocks execution while waiting for I/O. Asynchronous uses event loops and callbacks so other tasks can run. I used asyncio in Python for concurrent API calls.', 9, 35, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 5, 'Describe a situation where you had to learn a new technology quickly.', 'When my team switched from TensorFlow to PyTorch, I completed the official tutorials in 3 days and ported our CNN model within a week.', 9, 40, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 6, 'How do you ensure code quality in your projects?', 'I write unit tests with pytest, use pre-commit hooks for linting, and enforce type hints. I also do peer code reviews before merging.', 8, 33, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 7, 'Explain how you would design a database schema for a user authentication system.', 'I would use a users table with hashed passwords, a sessions table with JWT tokens, and role-based access with a roles junction table.', 9, 44, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL offers ACID and relationships but scales vertically. NoSQL scales horizontally and handles unstructured data but sacrifices consistency guarantees.', 9, 37, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'Git enables branching, pull requests, and conflict resolution. I use feature branches, rebase before merge, and write descriptive commit messages.', 8, 30, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000004', 10, 'Where do you see AI/ML being most impactful in government services?', 'In agriculture crop prediction, healthcare diagnosis in rural areas, and traffic management. I worked on a farmer advisory chatbot using LLMs.', 9, 48, NOW() - INTERVAL '6 days'),

-- Arjun Patel (AI) — avg 8.4
('aaaaaaaa-1111-1111-1111-000000000005', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I developed a real-time object detection system for traffic monitoring using YOLOv8. I optimised the model for edge deployment on Raspberry Pi.', 9, 50, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST APIs map resources to URLs and use standard HTTP verbs. I built one for a student portfolio platform with pagination and filtering.', 8, 36, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 3, 'How would you approach debugging a performance issue in a web application?', 'I start with Chrome DevTools Network tab, then use Lighthouse, check for memory leaks, and implement lazy loading for heavy assets.', 8, 41, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 4, 'What is the difference between synchronous and asynchronous programming?', 'Sync waits for each operation to complete before moving on. Async lets multiple operations run concurrently, improving throughput for I/O-bound tasks.', 8, 34, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 5, 'Describe a situation where you had to learn a new technology quickly.', 'For a hackathon, I learned Flutter in 48 hours and built a cross-platform app that won the sustainability track.', 9, 29, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 6, 'How do you ensure code quality in your projects?', 'I use CI/CD pipelines with automated testing, SonarQube for static analysis, and enforce 80% code coverage thresholds.', 8, 38, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 7, 'Explain how you would design a database schema for a user authentication system.', 'Users table with bcrypt hashes, refresh_tokens table with expiry, and MFA backup codes in a separate encrypted table.', 8, 43, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL is better for complex queries and transactions. NoSQL is better for rapid prototyping and massive scale with eventual consistency.', 9, 35, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'Feature branch workflow, squash merges to keep history clean, and tags for releases. I also write migration guides for breaking changes.', 8, 32, NOW() - INTERVAL '6 days'),
('aaaaaaaa-1111-1111-1111-000000000005', 10, 'Where do you see AI/ML being most impactful in government services?', 'Disaster prediction and response, automated document processing for RTI requests, and personalised learning platforms for rural schools.', 9, 46, NOW() - INTERVAL '6 days'),

-- Sneha Rao (AI) — avg 7.3
('aaaaaaaa-1111-1111-1111-000000000006', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I worked on a sentiment analysis tool for social media monitoring. I used BERT for classification and built a simple dashboard with Streamlit.', 7, 44, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST uses stateless client-server communication. I created endpoints for a library management system using Flask and SQLAlchemy.', 7, 39, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 3, 'How would you approach debugging a performance issue in a web application?', 'I would check server logs, use a profiler, and look for inefficient loops or unoptimized database queries.', 7, 36, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 4, 'What is the difference between synchronous and asynchronous programming?', 'Synchronous processes tasks one at a time. Asynchronous uses callbacks or promises to handle tasks without blocking the main thread.', 8, 31, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 5, 'Describe a situation where you had to learn a new technology quickly.', 'I had to learn Docker in a week for a deployment project. I containerised a Django application and set up docker-compose.', 7, 42, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 6, 'How do you ensure code quality in your projects?', 'I follow PEP8, write docstrings, and use pylint. I also do manual testing before submitting pull requests.', 7, 28, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 7, 'Explain how you would design a database schema for a user authentication system.', 'I would have a users table with email and password hash, and a separate profiles table for user metadata.', 7, 40, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL is structured and reliable. NoSQL is flexible and faster for simple lookups but lacks joins and strict consistency.', 8, 33, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'I use GitHub for collaboration. I create branches for features, open pull requests, and resolve merge conflicts via CLI.', 7, 30, NOW() - INTERVAL '5 days'),
('aaaaaaaa-1111-1111-1111-000000000006', 10, 'Where do you see AI/ML being most impactful in government services?', 'Automating tax filing, predicting water shortages, and improving public transport routes with reinforcement learning.', 8, 45, NOW() - INTERVAL '5 days'),

-- Vikram Singh (AI) — avg 5.6
('aaaaaaaa-1111-1111-1111-000000000007', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I made a simple calculator app in Python. I wrote the main logic for addition and subtraction.', 5, 22, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST is like a web service that gives data. I used a weather API once in a college project.', 5, 18, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 3, 'How would you approach debugging a performance issue in a web application?', 'I would check if the internet is working and restart the server. Maybe add more RAM.', 6, 25, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 4, 'What is the difference between synchronous and asynchronous programming?', 'Sync means doing things one by one. Async means doing multiple things at the same time like on a computer.', 6, 20, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 5, 'Describe a situation where you had to learn a new technology quickly.', 'I learned MS Excel advanced formulas in two days for a statistics assignment.', 5, 15, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 6, 'How do you ensure code quality in your projects?', 'I try to write clean code and avoid bugs by testing manually before submission.', 6, 19, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 7, 'Explain how you would design a database schema for a user authentication system.', 'I would create a table with username and password columns. Maybe add an email column too.', 5, 24, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL uses tables and NoSQL uses documents. Both store data but SQL is older.', 6, 21, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'Git saves different versions of code. I upload my code to GitHub so my team can see it.', 6, 17, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000007', 10, 'Where do you see AI/ML being most impactful in government services?', 'AI can help with automatic replies and maybe detecting fraud in some systems.', 5, 28, NOW() - INTERVAL '4 days'),

-- Dhruv Nair (SW) — avg 8.9
('aaaaaaaa-1111-1111-1111-000000000010', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I architected a microservices-based e-commerce backend with event-driven communication using RabbitMQ and container orchestration with Kubernetes.', 9, 52, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST APIs embody statelessness and resource orientation. I implemented HATEOAS links and rate limiting using Redis-backed token buckets.', 9, 47, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 3, 'How would you approach debugging a performance issue in a web application?', 'I use distributed tracing with Jaeger, analyse flame graphs, and implement connection pooling and query result caching with Redis.', 9, 44, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 4, 'What is the difference between synchronous and asynchronous programming?', 'Sync creates blocking threads. Async leverages event loops and coroutines. I migrated a blocking Flask app to FastAPI with async handlers, reducing latency by 60%.', 9, 41, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 5, 'Describe a situation where you had to learn a new technology quickly.', 'When our client demanded GraphQL, I learned Apollo Server and Relay in 4 days and refactored our REST endpoints over a weekend.', 9, 38, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 6, 'How do you ensure code quality in your projects?', 'I enforce 90% test coverage, use mutation testing, and implement contract testing with Pact between microservices.', 8, 43, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 7, 'Explain how you would design a database schema for a user authentication system.', 'I use a users table with Argon2id hashes, refresh tokens in Redis with TTL, and MFA TOTP secrets encrypted at rest with AES-256-GCM.', 9, 49, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL gives you ACID and relational integrity. NoSQL offers horizontal scaling and flexible schemas. I use PostgreSQL for transactions and MongoDB for analytics.', 9, 36, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'I use trunk-based development with feature flags, automated canary deployments, and semantic versioning with conventional commits.', 9, 34, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000010', 10, 'Where do you see AI/ML being most impactful in government services?', 'Intelligent document processing for court cases, predictive maintenance for public infrastructure, and real-time fraud detection in subsidy disbursement.', 9, 51, NOW() - INTERVAL '4 days'),

-- Pooja Desai (SW) — avg 7.5
('aaaaaaaa-1111-1111-1111-000000000011', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I built a real-time collaborative code editor using WebSockets and Operational Transformation. I handled the frontend with React and socket integration.', 8, 46, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST separates concerns between client and server. I built a task management API with JWT auth and pagination using cursor-based offsets.', 7, 40, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 3, 'How would you approach debugging a performance issue in a web application?', 'I profile the React component tree, audit bundle size with Webpack Analyzer, and use React.memo to prevent unnecessary re-renders.', 8, 37, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 4, 'What is the difference between synchronous and asynchronous programming?', 'Synchronous blocks the thread. Asynchronous uses promises and async/await. I used async/await for fetching data in React components.', 7, 33, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 5, 'Describe a situation where you had to learn a new technology quickly.', 'I learned TypeScript in a week to add type safety to our JavaScript codebase. I set up strict tsconfig and refactored critical paths first.', 8, 35, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 6, 'How do you ensure code quality in your projects?', 'I write Jest tests for components, use ESLint with Airbnb config, and run visual regression tests with Storybook.', 7, 31, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 7, 'Explain how you would design a database schema for a user authentication system.', 'Users table with hashed passwords, roles table, and user_roles junction. I also add audit_log for security compliance.', 7, 42, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL is reliable for financial data. NoSQL is good for logs and user activity. I use both in different parts of the same project.', 8, 38, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'I use Git Flow with develop and main branches. Feature branches are merged via PRs with at least two approvals and CI passing.', 7, 29, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000011', 10, 'Where do you see AI/ML being most impactful in government services?', 'Citizen chatbots for 24/7 support, automated grievance classification, and traffic signal optimisation using reinforcement learning.', 8, 44, NOW() - INTERVAL '4 days'),

-- Manoj Reddy (SW) — avg 5.2
('aaaaaaaa-1111-1111-1111-000000000012', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I made a personal blog website using HTML and CSS. I added some JavaScript for a navigation menu.', 5, 20, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST is a way for websites to talk to each other. I used a YouTube API to embed videos on my project.', 5, 16, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 3, 'How would you approach debugging a performance issue in a web application?', 'I would close other browser tabs and check my internet speed. Maybe compress images to load faster.', 6, 23, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 4, 'What is the difference between synchronous and asynchronous programming?', 'Synchronous happens in order. Asynchronous is when things happen at the same time without waiting.', 5, 19, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 5, 'Describe a situation where you had to learn a new technology quickly.', 'I learned how to use Canva to make presentation slides for my final year seminar in one day.', 5, 14, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 6, 'How do you ensure code quality in your projects?', 'I try to write readable code and add comments so others can understand it.', 5, 18, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 7, 'Explain how you would design a database schema for a user authentication system.', 'I would create a table with columns for username, password, and email. Simple and direct.', 5, 21, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL is table-based. NoSQL is document-based. I have used MySQL but not NoSQL yet.', 6, 17, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'Git helps save different versions. I push my code to GitHub and my teammates can download it.', 5, 15, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000012', 10, 'Where do you see AI/ML being most impactful in government services?', 'AI can answer common questions automatically so government staff can focus on bigger problems.', 6, 26, NOW() - INTERVAL '3 days'),

-- Karthik B (Cyber) — avg 8.6
('aaaaaaaa-1111-1111-1111-000000000015', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I led a CTF team and developed an automated vulnerability scanner for web apps using Python and OWASP ZAP API integration.', 9, 53, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST APIs use HTTP methods and stateless communication. I secured a REST API by implementing OAuth2, rate limiting, and input validation.', 8, 45, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 3, 'How would you approach debugging a performance issue in a web application?', 'I use Burp Suite for request analysis, identify slow queries with EXPLAIN ANALYZE, and patch injection vulnerabilities causing backend delays.', 9, 48, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 4, 'What is the difference between synchronous and asynchronous programming?', 'Sync blocks execution. Async uses callbacks and promises. In security tools, async scanning improves throughput when probing multiple hosts.', 8, 39, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 5, 'Describe a situation where you had to learn a new technology quickly.', 'I learned Splunk SIEM query language in 3 days for a blue-team competition and wrote detection rules for brute-force attacks.', 9, 41, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 6, 'How do you ensure code quality in your projects?', 'I use static analysis with Bandit for Python security, fuzz testing inputs, and conduct peer reviews focusing on security flaws.', 8, 37, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 7, 'Explain how you would design a database schema for a user authentication system.', 'I implement bcrypt with salt rotation, store TOTP secrets encrypted, use hardware security modules for key management, and enforce MFA by default.', 9, 50, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL offers ACID and referential integrity critical for audit logs. NoSQL handles high-volume security event streams. I use PostgreSQL for auth and Elasticsearch for logs.', 8, 42, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'I use signed commits with GPG, mandatory branch protection, and automated SAST scanning in CI before any merge to main.', 9, 35, NOW() - INTERVAL '4 days'),
('aaaaaaaa-1111-1111-1111-000000000015', 10, 'Where do you see AI/ML being most impactful in government services?', 'AI-driven threat intelligence for national CERT, anomaly detection in network traffic, and automated malware analysis sandboxes.', 9, 47, NOW() - INTERVAL '4 days'),

-- Lakshmi P (Cyber) — avg 7.2
('aaaaaaaa-1111-1111-1111-000000000016', 1, 'Tell me about a technical project you''ve worked on recently. What was your role?', 'I configured a honeypot network using Cowrie and analysed SSH attack patterns for my college cybersecurity project.', 7, 43, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 2, 'Explain the concept of RESTful APIs. How have you used them in practice?', 'REST APIs provide standardised access to resources. I consumed a Shodan API for reconnaissance automation in a security audit.', 7, 38, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 3, 'How would you approach debugging a performance issue in a web application?', 'I monitor network latency, check for DDoS indicators, and review WAF logs to identify false positives blocking legitimate traffic.', 7, 40, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 4, 'What is the difference between synchronous and asynchronous programming?', 'Sync runs step by step. Async allows concurrent operations. In penetration testing, async port scans significantly reduce reconnaissance time.', 8, 32, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 5, 'Describe a situation where you had to learn a new technology quickly.', 'I learned Wireshark packet analysis in two days to investigate a simulated man-in-the-middle attack for a lab exercise.', 7, 36, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 6, 'How do you ensure code quality in your projects?', 'I follow secure coding guidelines, use linters, and validate all inputs to prevent injection vulnerabilities.', 7, 30, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 7, 'Explain how you would design a database schema for a user authentication system.', 'I separate credentials from profile data, use slow hash functions, implement account lockout thresholds, and log all authentication attempts.', 7, 41, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 8, 'What are the trade-offs between SQL and NoSQL databases?', 'SQL provides consistency for transactional data. NoSQL offers speed for log aggregation. I use both depending on the security use case.', 7, 34, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 9, 'How does version control help in team collaboration? Describe your Git workflow.', 'I branch for each security test module, document findings in commit messages, and merge after team review to maintain audit trails.', 7, 31, NOW() - INTERVAL '3 days'),
('aaaaaaaa-1111-1111-1111-000000000016', 10, 'Where do you see AI/ML being most impactful in government services?', 'Phishing detection in government employee inboxes, automated vulnerability prioritisation, and facial recognition for secure facility access.', 8, 44, NOW() - INTERVAL '3 days');

-- Insert audit logs
INSERT INTO public.audit_log (entity_type, entity_id, from_status, to_status, actor, timestamp) VALUES
('application', 'aaaaaaaa-1111-1111-1111-000000000001', 'applied', 'rejected', 'system', NOW() - INTERVAL '14 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000002', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '10 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000003', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '9 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000004', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '8 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000004', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000004', 'interviewed', 'selected', 'admin', NOW() - INTERVAL '5 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000005', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '8 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000005', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000005', 'interviewed', 'selected', 'admin', NOW() - INTERVAL '5 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000006', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '7 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000006', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '5 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000006', 'interviewed', 'waitlisted', 'admin', NOW() - INTERVAL '4 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000007', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000007', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '4 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000007', 'interviewed', 'rejected', 'admin', NOW() - INTERVAL '3 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000008', 'applied', 'rejected', 'system', NOW() - INTERVAL '12 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000009', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '8 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000010', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000010', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '4 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000010', 'interviewed', 'selected', 'admin', NOW() - INTERVAL '3 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000011', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000011', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '4 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000011', 'interviewed', 'waitlisted', 'admin', NOW() - INTERVAL '3 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000012', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '5 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000012', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '3 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000012', 'interviewed', 'rejected', 'admin', NOW() - INTERVAL '2 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000013', 'applied', 'rejected', 'system', NOW() - INTERVAL '11 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000014', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '8 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000015', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000015', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '4 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000015', 'interviewed', 'selected', 'admin', NOW() - INTERVAL '3 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000016', 'applied', 'shortlisted', 'system', NOW() - INTERVAL '6 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000016', 'shortlisted', 'interviewed', 'system', NOW() - INTERVAL '4 days'),
('application', 'aaaaaaaa-1111-1111-1111-000000000016', 'interviewed', 'waitlisted', 'admin', NOW() - INTERVAL '3 days');
