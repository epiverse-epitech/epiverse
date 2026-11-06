-- CreateTable
CREATE TABLE user_cgu_acceptance (
    user_id     INTEGER NOT NULL,
    version     VARCHAR(20) NOT NULL,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_user_cgu_acceptance PRIMARY KEY (user_id, version)
);
COMMENT ON TABLE user_cgu_acceptance IS 'CGU accepted by the user: a row for the current version = CGU accepted. One row per accepted version.';

-- AddForeignKey
ALTER TABLE user_cgu_acceptance ADD CONSTRAINT fk_user_cgu_acceptance_user_id_users
    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE;
