CREATE TABLE `content_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section` varchar(64) NOT NULL DEFAULT 'custom',
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` text NOT NULL,
	`linkUrl` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `content_blocks_section_idx` ON `content_blocks` (`section`);--> statement-breakpoint
CREATE INDEX `content_blocks_order_idx` ON `content_blocks` (`sortOrder`);