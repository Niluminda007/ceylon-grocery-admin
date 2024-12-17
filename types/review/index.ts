import { Review, User } from "@prisma/client";

export type ExtendedReview = Review & { user: User };
