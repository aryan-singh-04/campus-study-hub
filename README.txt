CAMPUS STUDY HUB — FRONTEND ONLY
=================================

REQUIREMENTS
- Windows 10/11
- A modern browser (Chrome, Edge, Firefox)
- No Node.js, backend, database, or build tools required

RUN LOCALLY
1. Extract the ZIP file.
2. Open the campus-study-hub folder.
3. Double-click index.html.
   OR open PowerShell in this folder and run:
       start index.html

OPTIONAL: RUN WITH VS CODE LIVE SERVER
1. Open this folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click index.html -> Open with Live Server.

PROJECT FILES
- index.html : page structure
- style.css  : responsive blue-and-white design
- script.js  : navigation, search, and sample content data
- pdfs/      : sample downloadable PDF files

HOW TO ADD YOUR OWN PDF
1. Copy your PDF into the matching folder:
   pdfs/question-papers/
   pdfs/important-questions/
   pdfs/notes/
2. Open script.js and find STUDY_DATA.
3. Find the subject and section where you want to add the file.
4. Add an item using this pattern:
   { title: "DBMS Paper 2024", year: "2024", file: "pdfs/question-papers/dbms-2024.pdf" }

For notes or important questions you can use:
   { title: "DBMS Unit 1 Notes", detail: "Unit 1", file: "pdfs/notes/dbms-unit-1.pdf" }

IMPORTANT
- Included PDFs are demo examples, NOT official university papers.
- Replace them with material you are allowed to share.
- This is a static frontend. Changes in script.js are made by editing the file.
- There is no admin upload panel, student account, or shared cloud storage.
- When publishing the website, upload the whole folder (including pdfs/) to a static host such as GitHub Pages or Netlify.
