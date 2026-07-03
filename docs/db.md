## Table `department`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `name` | `varchar` |  Unique |
| `code` | `varchar` |  Unique |

## Table `placement_year`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `year` | `int2` |  Unique |
| `total_students_eligible` | `int4` |  |
| `placement_rate` | `numeric` |  Nullable |
| `avg_package` | `numeric` |  Nullable |
| `highest_package` | `numeric` |  Nullable |
| `median_package` | `numeric` |  Nullable |
| `total_offers` | `int4` |  |

## Table `recruiter`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `company_name` | `varchar` |  Unique |
| `industry` | `varchar` |  Nullable |
| `website` | `varchar` |  Nullable |
| `contact_name` | `varchar` |  Nullable |
| `contact_email` | `varchar` |  Nullable |
| `first_visited_year` | `int2` |  Nullable |
| `logo_url` | `text` |  Nullable |
| `created_at` | `timestamptz` |  |

## Table `recruiter_visit`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `recruiter_id` | `int4` |  |
| `placement_year_id` | `int4` |  |
| `visit_date` | `date` |  Nullable |
| `min_package` | `numeric` |  Nullable |
| `max_package` | `numeric` |  Nullable |
| `total_offers` | `int4` |  Nullable |
| `visit` | `visit_type` |  Nullable |

## Table `dept_year_stats`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `department_id` | `int4` |  |
| `placement_year_id` | `int4` |  |
| `placed_count` | `int4` |  |
| `avg_package` | `numeric` |  Nullable |
| `highest_package` | `numeric` |  Nullable |
| `placement_rate` | `numeric` |  Nullable |

## Table `assets`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `placement_id` | `int4` |  Nullable |
| `asset_type` | `text` |  |
| `image_url` | `text` |  |
| `created_at` | `timestamptz` |  |

## Table `users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Nullable |
| `email` | `text` |  Nullable |
| `role` | `user_role` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `recruiter_contact`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `recruiter_id` | `int4` |  |
| `contact_name` | `varchar` |  Nullable |
| `contact_email` | `varchar` |  Nullable |
| `contact_phone` | `varchar` |  Nullable |
| `is_primary` | `bool` |  |
| `created_at` | `timestamptz` |  |

## Table `recruiter_visit_department`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `recruiter_visit_id` | `int4` |  |
| `department_id` | `int4` |  |
| `offers_count` | `int4` |  |

