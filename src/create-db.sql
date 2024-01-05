CREATE TABLE IF NOT EXISTS site(
  [id] INTEGER PRIMARY KEY NOT NULL,
  [name] VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS properties(
  [link] VARCHAR NOT NULL PRIMARY KEY,
  [title] VARCHAR NOT NULL,
  [address] VARCHAR NULL,
  [description] VARCHAR NULL,
  [price] VARCHAR NULL,
  [insert_date] DATE DEFAULT (DATETIME('now')),
  [site_id] INTEGER NOT NULL,

  FOREIGN KEY (site_id) REFERENCES site(id)
);