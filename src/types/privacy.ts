export interface PublicPrivacyFlags {
  is_public: boolean;
  share_tracker: boolean;
  show_ratings: boolean;
  show_reviews: boolean;
  show_friends?: boolean;
  show_item_status?: boolean;
}

export const PRIVATE_PUBLIC_FLAGS: PublicPrivacyFlags = {
  is_public: false,
  share_tracker: false,
  show_ratings: false,
  show_reviews: false,
  show_friends: false,
  show_item_status: false,
};
