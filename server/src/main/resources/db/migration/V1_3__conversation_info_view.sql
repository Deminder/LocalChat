
CREATE VIEW conversation_info (id, last_author_date, last_change_date) AS
SELECT c.id, GREATEST(MAX(cm.author_date), c.create_date), GREATEST(MAX(cm.last_change), c.create_date)
FROM conversation c
LEFT JOIN conversation_message cm ON cm.conversation_id = c.id
GROUP BY c.id;


CREATE VIEW member_info (id, last_author_date, last_change_date) AS
SELECT m.id, GREATEST(MAX(cm.author_date), m.join_date), GREATEST(MAX(cm.last_change), m.join_date)
FROM member m
LEFT JOIN conversation_message cm ON cm.conversation_id = m.conversation_id
GROUP BY m.id;