CREATE TRIGGER update_post_privacy
AFTER UPDATE OF privacy ON posts
FOR EACH ROW
WHEN OLD.privacy = 'almost_private' AND NEW.privacy != 'almost_private'
BEGIN
    DELETE FROM post_visibilities WHERE post_id = NEW.id;
END;