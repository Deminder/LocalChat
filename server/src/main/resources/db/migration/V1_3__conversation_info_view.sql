
CREATE VIEW conversation_info (id, last_author_date, last_change_date) AS
SELECT c.id, MAX(cm.author_date), MAX(cm.last_change)
FROM conversation c
LEFT JOIN conversation_message cm ON cm.conversation_id = c.id
GROUP BY c.id;


CREATE VIEW member_info (id, last_author_date, last_change_date) AS
SELECT m.id, MAX(cm.author_date), MAX(cm.last_change)
FROM member m
LEFT JOIN conversation_message cm ON cm.conversation_id = m.conversation_id
GROUP BY m.id;