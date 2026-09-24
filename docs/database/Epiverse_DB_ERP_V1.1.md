erDiagram
	user }o--|| user_type : references
	user }o--|| school : references
	user }o--|| company : references
	student_profile ||--|| user : references
	user_role }o--|| user : references
	user_role }o--|| role : references
	role_permission }o--|| role : references
	role_permission }o--|| permission : references
	association }o--|| school : references
	user_association }o--|| user : references
	user_association }o--|| association : references
	category }o--|| category : references
	news }o--|| user : references
	news }o--|| school : references
	resource }o--|| school : references
	event }o--|| event_category : references
	news_category }o--|| news : references
	news_category }o--|| category : references
	resource_category }o--|| resource : references
	resource_category }o--|| category : references
	company_event }o--|| company : references
	company_event }o--|| event : references
	school_event }o--|| school : references
	school_event }o--|| event : references
	association_event }o--|| association : references
	association_event }o--|| event : references
	user_event }o--|| user : references
	user_event }o--|| event : references
	user_interaction }o--|| user : references
	recommendation }o--|| user : references
	log }o--|| user : references

	user_type {
		BIGINT id
		VARCHAR(50) name
	}

	user {
		BIGINT id
		VARCHAR(50) first_name
		VARCHAR(50) last_name
		VARCHAR(255) email
		VARCHAR(255) password_hash
		BIGINT user_type_id
		BIGINT school_id
		BIGINT company_id
		BOOLEAN is_active
		TIMESTAMPTZ last_login_at
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
		TIMESTAMPTZ deleted_at
	}

	student_profile {
		BIGINT user_id
		VARCHAR(100) program
		SMALLINT year_level
		SMALLINT graduation_year
		VARCHAR(100) city
		TEXT bio
		TIMESTAMPTZ updated_at
	}

	role {
		BIGINT id
		VARCHAR(50) name
		TEXT description
		TIMESTAMPTZ created_at
	}

	permission {
		BIGINT id
		VARCHAR(100) code
		TEXT description
	}

	role_permission {
		BIGINT role_id
		BIGINT permission_id
	}

	user_role {
		BIGINT user_id
		BIGINT role_id
		TIMESTAMPTZ granted_at
	}

	school {
		BIGINT id
		VARCHAR(150) name
		VARCHAR(255) domain
		VARCHAR(2048) website_url
		VARCHAR(255) address
		VARCHAR(20) postal_code
		VARCHAR(100) city
		VARCHAR(100) country
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	company {
		BIGINT id
		VARCHAR(150) name
		VARCHAR(255) domain
		VARCHAR(2048) website_url
		TEXT description
		VARCHAR(255) address
		VARCHAR(20) postal_code
		VARCHAR(100) city
		VARCHAR(100) country
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	association {
		BIGINT id
		VARCHAR(150) name
		TEXT description
		BIGINT school_id
		VARCHAR(2048) website_url
		BOOLEAN is_active
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	user_association {
		BIGINT user_id
		BIGINT association_id
		association_role role
		TIMESTAMPTZ joined_at
	}

	category {
		BIGINT id
		VARCHAR(50) name
		VARCHAR(50) slug
		BIGINT parent_id
	}

	event_category {
		BIGINT id
		VARCHAR(50) name
		VARCHAR(50) slug
	}

	news {
		BIGINT id
		VARCHAR(255) title
		JSONB body
		BIGINT author_id
		BIGINT school_id
		content_status status
		TIMESTAMPTZ published_at
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	resource {
		BIGINT id
		VARCHAR(255) name
		TEXT description
		VARCHAR(2048) url
		VARCHAR(30) resource_type
		BIGINT school_id
		content_status status
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	event {
		BIGINT id
		VARCHAR(255) name
		TEXT description
		BIGINT event_category_id
		TIMESTAMPTZ datetime_start
		TIMESTAMPTZ datetime_end
		VARCHAR(255) location
		BOOLEAN is_online
		INTEGER capacity
		event_status status
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	news_category {
		BIGINT news_id
		BIGINT category_id
	}

	resource_category {
		BIGINT resource_id
		BIGINT category_id
	}

	company_event {
		BIGINT company_id
		BIGINT event_id
	}

	school_event {
		BIGINT school_id
		BIGINT event_id
	}

	association_event {
		BIGINT association_id
		BIGINT event_id
	}

	user_event {
		BIGINT user_id
		BIGINT event_id
		user_event_status status
		TIMESTAMPTZ created_at
		TIMESTAMPTZ updated_at
	}

	user_interaction {
		BIGINT id
		BIGINT user_id
		target_type target_type
		BIGINT target_id
		interaction_action action
		JSONB context
		TIMESTAMPTZ created_at
	}

	recommendation {
		BIGINT id
		BIGINT user_id
		target_type target_type
		BIGINT target_id
		REAL score
		VARCHAR(50) model_version
		TEXT reason
		TIMESTAMPTZ generated_at
		TIMESTAMPTZ shown_at
		TIMESTAMPTZ clicked_at
		reco_feedback feedback
	}

	content_embedding {
		target_type target_type
		BIGINT target_id
		VARCHAR(50) model_version
		VECTOR embedding
		TIMESTAMPTZ updated_at
	}

	log {
		BIGINT id
		log_level level
		BIGINT user_id
		VARCHAR(100) action
		VARCHAR(50) entity_type
		BIGINT entity_id
		TEXT message
		JSONB payload
		VARCHAR(45) ip_address
		VARCHAR(512) user_agent
		TIMESTAMPTZ created_at
	}