USE Discuss;

ALTER TABLE Migrations CHANGE DateRun DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;