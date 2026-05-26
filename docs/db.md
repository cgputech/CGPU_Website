## Table `assets`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `recruitment_id` | `int4` |  Nullable |
| `asset_type` | `text` |  |
| `image_url` | `text` |  |
| `created_at` | `timestamptz` |  |

## Table `department`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `name` | `varchar` |  Unique |
| `code` | `varchar` |  Unique |
| `head_of_dept` | `varchar` |  Nullable |

## Table `dept_year_stats`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `department_id` | `int4` |  |
| `placement_year_id` | `int4` |  |
| `eligible_count` | `int4` |  |
| `placed_count` | `int4` |  |
| `avg_package` | `numeric` |  Nullable |
| `highest_package` | `numeric` |  Nullable |
| `placement_rate` | `numeric` |  Nullable |

## Table `offer`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `student_id` | `int4` |  |
| `recruiter_visit_id` | `int4` |  |
| `package_lpa` | `numeric` |  |
| `role_title` | `varchar` |  Nullable |
| `offer_status` | `varchar` |  |
| `is_accepted` | `bool` |  |
| `joining_date` | `date` |  Nullable |

## Table `placement_year`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `year` | `int2` |  Unique |
| `total_students_eligible` | `int4` |  |
| `total_placed` | `int4` |  |
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

## Table `recruiter_visit`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `recruiter_id` | `int4` |  |
| `placement_year_id` | `int4` |  |
| `visit_date` | `date` |  Nullable |
| `roles_offered` | `text` |  Nullable |
| `students_placed` | `int4` |  |
| `avg_package` | `numeric` |  Nullable |
| `highest_package` | `numeric` |  Nullable |
| `total_offers_made` | `int4` |  |

## Table `student`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `roll_number` | `varchar` |  Unique |
| `full_name` | `varchar` |  |
| `department_id` | `int4` |  |
| `graduation_year` | `int2` |  |
| `cgpa` | `numeric` |  Nullable |
| `email` | `varchar` |  Nullable Unique |
| `is_eligible` | `bool` |  |
| `linkedin` | `text` |  Nullable |

## Table `users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Nullable |
| `email` | `text` |  Nullable |
| `class` | `text` |  Nullable |
| `roll_number` | `text` |  Nullable |
| `department` | `text` |  Nullable |
| `role` | `user_role` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

