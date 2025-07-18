PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_schedule_song` (
	`schedule_id` integer NOT NULL,
	`song_id` integer NOT NULL,
	PRIMARY KEY(`song_id`, `schedule_id`),
	FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_schedule_song`("schedule_id", "song_id") SELECT "schedule_id", "song_id" FROM `schedule_song`;--> statement-breakpoint
DROP TABLE `schedule_song`;--> statement-breakpoint
ALTER TABLE `__new_schedule_song` RENAME TO `schedule_song`;--> statement-breakpoint
PRAGMA foreign_keys=ON;