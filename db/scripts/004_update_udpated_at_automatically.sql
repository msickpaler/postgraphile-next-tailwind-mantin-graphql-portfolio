CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_udpatedAt BEFORE UPDATE ON core.User FOR EACH ROW EXECUTE PROCEDURE  update_updated_at();
CREATE TRIGGER update_post_udpatedAt BEFORE UPDATE ON core.Post FOR EACH ROW EXECUTE PROCEDURE  update_updated_at();
