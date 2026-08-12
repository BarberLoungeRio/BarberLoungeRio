CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`price` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`tag` varchar(64) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`key` varchar(96) NOT NULL,
	`label` varchar(160) NOT NULL,
	`section` varchar(64) NOT NULL,
	`value` text NOT NULL,
	`fieldType` enum('text','textarea','url','color') NOT NULL DEFAULT 'text',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedBy` int,
	CONSTRAINT `site_content_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` varchar(96) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedBy` int,
	CONSTRAINT `site_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `youtube_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`youtubeId` varchar(32) NOT NULL,
	`url` text NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`tag` varchar(64) NOT NULL DEFAULT 'Drops TV',
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `youtube_videos_id` PRIMARY KEY(`id`),
	CONSTRAINT `youtube_videos_youtubeId_unique` UNIQUE(`youtubeId`)
);
--> statement-breakpoint
CREATE INDEX `services_order_idx` ON `services` (`sortOrder`);--> statement-breakpoint
CREATE INDEX `site_content_section_idx` ON `site_content` (`section`);--> statement-breakpoint
CREATE INDEX `youtube_videos_order_idx` ON `youtube_videos` (`sortOrder`);