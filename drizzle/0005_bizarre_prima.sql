CREATE TABLE `featured_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(160) NOT NULL,
	`authorPhoto` text,
	`authorUri` text,
	`rating` int NOT NULL DEFAULT 5,
	`text` text NOT NULL,
	`relativeTime` varchar(96) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `featured_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `featured_reviews_order_idx` ON `featured_reviews` (`sortOrder`);