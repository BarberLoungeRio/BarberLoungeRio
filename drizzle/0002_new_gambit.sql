CREATE TABLE `thrift_store_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageUrl` text NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `thrift_store_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `thrift_store_items_order_idx` ON `thrift_store_items` (`sortOrder`);