CREATE DATABASE  IF NOT EXISTS `taskwave` ;
USE `taskwave`;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_team_id` bigint unsigned DEFAULT NULL,
  `profile_photo_path` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES ('019627fe-8b0b-723a-9667-1343062e0f67','MUTUGI INC','mutugi001','collinsmut04@gmail.com',NULL,'$2y$12$xPfGrKvoHIH0qc0keHDTE.RNH8CZC3HQVW8xPNr8gTOpqKmaXw0Ju',NULL,NULL,NULL,'2025-04-12 00:15:15','2025-05-30 07:47:30');
UNLOCK TABLES;
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
LOCK TABLES `cache` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `cache_locks` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `failed_jobs` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `job_batches` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `jobs` WRITE;
UNLOCK TABLES;





DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `members_email_unique` (`email`),
  KEY `members_user_id_foreign` (`user_id`),
  CONSTRAINT `members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `members` WRITE;
INSERT INTO `members` VALUES ('01965d04-96f7-7292-8e0c-45335bcec46a','019627fe-8b0b-723a-9667-1343062e0f67','Collins Mutugi','collinsmut04@gmail.com','+254798718682','Member',NULL,'2025-04-22 07:21:44','2025-04-22 07:21:44');
UNLOCK TABLES;


DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `migrations` WRITE;
INSERT INTO `migrations` VALUES (9,'0001_01_01_000000_create_users_table',1),(10,'0001_01_01_000001_create_cache_table',1),(11,'0001_01_01_000002_create_jobs_table',1),(12,'2025_04_11_234623_create_personal_access_tokens_table',1),(13,'2025_04_12_024324_create_projects_table',2),(15,'2025_04_15_120406_create_tasks_table',3),(16,'2025_04_15_191024_create_teams_table',4),(25,'2025_04_15_200045_create_members_table',5),(27,'2025_04_21_094712_create_whatsapps_table',6);
UNLOCK TABLES;


DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `password_reset_tokens` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `personal_access_tokens` WRITE;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','mutugi001','a0b712b3a0fcbb75097c4a689c43a0009e57e7934fc8a3aec0e28413134d4acc','[\"*\"]',NULL,NULL,'2025-04-12 00:15:15','2025-04-12 00:15:15'),(4,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','7f7ef46b1c48d0f77ebdae74e1fa2efba47e590121185005862c45b6c6e4d1e1','[\"*\"]','2025-04-15 08:20:56',NULL,'2025-04-15 07:36:28','2025-04-15 08:20:56'),(5,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','dcd5bc7a79c8aa1038272bacc1ebdb359b39da7ef742f0ddd44c040212216329','[\"*\"]','2025-04-15 08:38:11',NULL,'2025-04-15 08:20:54','2025-04-15 08:38:11'),(6,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','12d4134273a60ab22edc58edd4612ee786f30c765449cf7522934cebff416cdb','[\"*\"]','2025-04-15 13:04:04',NULL,'2025-04-15 08:38:17','2025-04-15 13:04:04'),(8,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','7e0f45d2f134ee87efec6686f27ef2bf140c14bdd1f92be363bd04c93a47dd7e','[\"*\"]','2025-04-17 05:27:19',NULL,'2025-04-17 05:25:47','2025-04-17 05:27:19'),(9,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','b12cebbe08ddb08cc3eedad68bbea039724b01d7677054136694b091213a9e54','[\"*\"]','2025-04-18 12:24:27',NULL,'2025-04-18 10:43:47','2025-04-18 12:24:27'),(10,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','7f6780d7b071ba484bcb1210767d7aa25b0d13c0da1a09987e8fef927fd030ff','[\"*\"]','2025-04-22 06:38:32',NULL,'2025-04-21 06:35:09','2025-04-22 06:38:32'),(11,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','d37a18eaee942d3ac34018970543f060d0b206873ef3ec5678f0a6c65e9e9496','[\"*\"]','2025-04-22 10:08:05',NULL,'2025-04-22 06:45:23','2025-04-22 10:08:05'),(12,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','3cee22f30ed846330be08834e3dce646dd5d36132fb32128836c0cbaf86c094a','[\"*\"]','2025-04-22 10:49:30',NULL,'2025-04-22 10:08:03','2025-04-22 10:49:30'),(14,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','efea4c8fb06ab8a857d1a14fc31dff02d9b82f4304427701b8e85442b6f4bcbf','[\"*\"]','2025-05-21 10:37:29',NULL,'2025-05-20 15:25:03','2025-05-21 10:37:29'),(15,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','1918ee4dd35e2e259fd63f00ebedc8e8a258c1d55c22be32662fb80a6adfb85e','[\"*\"]','2025-05-21 13:00:30',NULL,'2025-05-21 10:37:32','2025-05-21 13:00:30'),(17,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','a882179f0384c2e99363d3d7ee6953eaebe76c100eafdae5958bb68a31ecbfff','[\"*\"]','2025-05-30 07:47:44',NULL,'2025-05-30 07:47:40','2025-05-30 07:47:44'),(18,'App\\Models\\User','019627fe-8b0b-723a-9667-1343062e0f67','collinsmut04@gmail.com','1baabf0b183fe71d8ff15a6a2187204077abcdb4778089b5c284a588892a79ac','[\"*\"]','2025-05-30 08:17:23',NULL,'2025-05-30 07:51:59','2025-05-30 08:17:23');
UNLOCK TABLES;


DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `objectives` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_user_id_foreign` (`user_id`),
  CONSTRAINT `projects_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `projects` WRITE;
INSERT INTO `projects` VALUES ('01jrwm2xy4vkghawzpfcsr8asm','019627fe-8b0b-723a-9667-1343062e0f67','DEVOPS','Dolorum consequuntur','Ut odit sint modi vo','Aut magni consectetu','2012-07-09','2026-05-24','active','2025-04-15 08:41:53','2025-05-21 10:37:49'),('01jsegk7nrpxn9s9pn5jmkepm8','019627fe-8b0b-723a-9667-1343062e0f67','Frontend devops','create a website page','Development','create a website page','2025-04-22','2025-07-22','active','2025-04-22 07:27:13','2025-04-22 07:27:13');
UNLOCK TABLES;


DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `sessions` WRITE;
INSERT INTO `sessions` VALUES ('0rYiCMBxsbh4aYt7dzPYLezKGnrZPxDzkfp6VVup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUptaEcydDZHbjRHY0Z4Z0ZCTk9pa0hwMWFJNEFvdnpNdG9tMG9EWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1748513500),('1X3ngDq1WNLoDIPlegEHu8kpfZmVb4G2P985ulPF',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUNmNU5zZTdkNmoxZnk0ZTNaV2d2c1VIT0k5YWlJbU5hbnNNdWh3WiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1744728885),('2E1wu5xIh8Ip7sAnd3xcudQLVDUPsMmrAFdyybUb',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHJxbmtrWUJBT1pvU1RKQ3AyN09yV1pzYnhWUDdKN2JOVzZRUE53diI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1744441271),('D4267qWFfbWuaRugzvtvC3YyViib5XUrFLDWWIAL',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibUI0cmhJTzViN1ROaDdvYmN6dVdOb0JiN1RMdWh1TmlkbWNSMG0weCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1747765498),('fvBDbgL7tCm01MNmRcZddPSp2fdSskjcA6A2b6vv',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoieThTSHlGSFRGOWdvbXN3elNWajR2RGFqMWFjUlN1c0lKZ0J3WHFYOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1746463958),('Itt41DK2MVpYqCtEsPcBA9zji9IyoJpLNOPG0rVF',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVVNOcVc4UVRGVTRaZVBkSnlScEVlZVpkbDhrd2w4Uk04Z1VHcllNNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1745228100),('ItzYgBRkAfQChvwfC6bKMpi2AuZypSwPtzCSxolK',NULL,'127.0.0.1','PostmanRuntime/7.43.3','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkI0ZW1GdE5XQlpZTEdjc0hmWjJoc0ZkT3hyYzN1U3AyOG5ERzNiViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zZW5kLXRlc3QtbWVzc2FnZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1745317158),('jJqE03hOsFmeqcbitLbwklL82CZHTVTdcOtA7JrS',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiN08xTUNmMTlqdkFKb0g0NDgzaDBYaHZVYzU1WVNjZnZCNG9yY1NaVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1745327277),('jSGhEn1F1flEo8mR3CVHGInGDcRuZpbgbliy1rUr',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoieDU4cEZ2dGpuVXhXUHVueUZEV2tCcENHRVBJVzlJZ3pTVG41dkVVViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1744427716),('LCdsimM14IJBHx11I3ZDpuUQbD3r429CoIIuM6KH',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2NtWjhKVWpNcmZ0alNTQ29wWE11YW0zdEFmVUpuNm1BZnJxZGdOUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1744878344),('oX7OFPix3DINSCNW5NSqSYwu4kGOoGlveCuVADdU',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzNkMmlWUnk1bjVDcFFGWlZDbjAzS1E3WHR3cXZwakJLN1p0S2NLTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1748602317),('r1VY9F2cWXiGv681cSzRGtx3QNY3CgggEqeVzWQa',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXNDRzVpZWpyRUNHYjFoMUhFVHNTVElwUVZLdUxLckJHdEZHTzFPaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1747834648),('Ruu1I3icSSTitZGpCtZVY8rYpElvVMuxJpCyD01I',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUUhMYnZNWDNOekpsa2hYM0R1ZzRKTzNGSk40ZUdEY0pvaGp4UFdRQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1745394295),('tynrzvQGhBmkJkX0aEdYM4tE0HM8SmDdFjSXrepa',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFgybUZpdkExeEJkWkxrRmw3YnVSUG9aN2FwZTJvbVRwUjlBWDJDUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1744717093),('wH499d3Enqg5IYfIAL4MoSSTVDOeT8SEf58nNinD',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOWdnWGJLVkpKZnhUN0FoZzdKeTNDbFV1YVJlc2t0MDhFNXdJMXVMWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1745315120),('zUbn3fjAg9CC7ueo5bOYzD90vAr3fMWGxosluDsA',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTRpcjBOVEdYTlZwc3dEQzVKQ0FCdVBqNTZPWXJKNjdMQlJQdnNSaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1744983820);
UNLOCK TABLES;


DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` date NOT NULL,
  `assigned_team` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dependent_task_id` char(26) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_project_id_foreign` (`project_id`),
  KEY `tasks_dependent_task_id_foreign` (`dependent_task_id`),
  CONSTRAINT `tasks_dependent_task_id_foreign` FOREIGN KEY (`dependent_task_id`) REFERENCES `tasks` (`id`),
  CONSTRAINT `tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `tasks` WRITE;
INSERT INTO `tasks` VALUES ('01jrx70c83awttn1g9gf90f0ak','01jrwm2xy4vkghawzpfcsr8asm','Ad in debitis proide','Corporis laborum iru','completed','2016-10-11',NULL,NULL,'2025-04-15 14:12:33','2025-05-21 10:57:18'),('01jrx71dvzzy3xrv91jq6v9dtv','01jrwm2xy4vkghawzpfcsr8asm','Voluptate et sint vo','Reiciendis nihil et','completed','2018-02-24','user2',NULL,'2025-04-15 14:13:07','2025-05-21 10:57:25'),('01jrx721th25132btqzdt4pb09','01jrwm2xy4vkghawzpfcsr8asm','Qui assumenda et aut','Et et sunt tempore','completed','1998-01-13','user2',NULL,'2025-04-15 14:13:28','2025-04-15 14:13:28'),('01jrx7pk4dmgyy1rgm1ntahmkj','01jrwm2xy4vkghawzpfcsr8asm','Quaerat facilis exer','Sit obcaecati natus','not_started','2017-09-30',NULL,NULL,'2025-04-15 14:24:41','2025-04-15 14:24:41'),('01js1dq1zwgchefaqtyy4sqswh','01jrwm2xy4vkghawzpfcsr8asm','Quae sit quos paria','Labore libero aute c','in_progress','1983-03-03','user1',NULL,'2025-04-17 05:26:45','2025-04-17 05:26:45'),('01jweh1sje663jce7k80q3m80c','01jsegk7nrpxn9s9pn5jmkepm8','Backend development','dsfg','in_progress','2025-05-31','01jseg85crfqhkqenc3548j6sa',NULL,'2025-05-29 14:22:16','2025-05-29 14:22:16'),('01jwej7b18kkarpej9dn7rb01c','01jsegk7nrpxn9s9pn5jmkepm8','Frontend vevops','efg','review','2025-05-31','01jseg85crfqhkqenc3548j6sa',NULL,'2025-05-29 14:42:46','2025-05-29 14:42:46');
UNLOCK TABLES;


DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` char(26) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teams_user_id_foreign` (`user_id`),
  CONSTRAINT `teams_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `teams` WRITE;
INSERT INTO `teams` VALUES ('01jrxgj3vq1ryrygevtchfy3sx','019627fe-8b0b-723a-9667-1343062e0f67','Rooney Kinney','Excepturi perferendi','2025-04-15 16:59:31','2025-04-15 16:59:31'),('01jseg85crfqhkqenc3548j6sa','019627fe-8b0b-723a-9667-1343062e0f67','FrontEnd Crew','Develop frontend wireframes and pages','2025-04-22 07:21:10','2025-04-22 07:21:10');
UNLOCK TABLES;

DROP TABLE IF EXISTS `member_team`;
CREATE TABLE `member_team` (
  `member_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`member_id`,`team_id`),
  KEY `member_team_team_id_foreign` (`team_id`),
  CONSTRAINT `member_team_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_team_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `member_team` WRITE;
INSERT INTO `member_team` VALUES ('01965d04-96f7-7292-8e0c-45335bcec46a','01jseg85crfqhkqenc3548j6sa');
UNLOCK TABLES;




DROP TABLE IF EXISTS `whatsapps`;
CREATE TABLE `whatsapps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `whatsapps_number_unique` (`number`),
  UNIQUE KEY `whatsapps_token_unique` (`token`),
  KEY `whatsapps_user_id_foreign` (`user_id`),
  CONSTRAINT `whatsapps_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `whatsapps` WRITE;
INSERT INTO `whatsapps` VALUES (8,'019627fe-8b0b-723a-9667-1343062e0f67','460380510503068','EAAQVTJGD964BO8zunqi7w9vxxyDVqAlB19zEBx97aQ7ViIHZBKog2usWfAHVA9Q59GEQu5YN3R0zmE3tArB00QDBClu6HQ5soOdEoYF2sIZCWrcoxtkusqczGUK4LdjtQlTQvDk02WZBg3u24fdf7Hoj1dZCcwKOoBRauTS0AnRnPfIElhE4SE9tYZABCaZAmIz8WtswaaDlemcyP1ZAPdHsFosrh0CXj7ONUHZChMrc','2025-04-22 07:14:42','2025-05-29 16:20:40');
UNLOCK TABLES;
