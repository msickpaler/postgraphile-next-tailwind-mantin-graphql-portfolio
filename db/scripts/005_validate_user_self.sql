ALTER TABLE core.User ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.Post ENABLE ROW LEVEL SECURITY;

create function current_uid() returns VARCHAR as $$
select
	current_setting('jwt.claims.uid')::VARCHAR
$$ language sql stable;

CREATE POLICY insert_user ON core.User FOR INSERT WITH CHECK (id = current_uid());
CREATE POLICY select_user ON core.User FOR SELECT USING (true);
CREATE POLICY update_user ON core.User FOR UPDATE USING (id = current_uid());
CREATE POLICY delete_user ON core.User FOR DELETE USING (id = current_uid());

CREATE POLICY insert_post ON core.Post FOR INSERT WITH CHECK (author_id = current_uid());
CREATE POLICY select_post ON core.Post FOR SELECT USING (true);
CREATE POLICY update_post ON core.Post FOR UPDATE USING (author_id = current_uid());
CREATE POLICY delete_post ON core.Post FOR DELETE USING (author_id = current_uid());