import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  type MediaItem = {
    id : Nat;
    title : Text;
    description : Text;
    mediaType : Text; // "photo" or "video"
    blobId : Text;
    sortOrder : Int;
    createdAt : Int;
  };

  module MediaItem {
    public func compare(item1 : MediaItem, item2 : MediaItem) : Order.Order {
      Int.compare(item1.sortOrder, item2.sortOrder);
    };
  };

  type AppSettings = {
    appName : Text;
    theme : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Storage
  include MixinStorage();

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let mediaItems = Map.empty<Nat, MediaItem>();
  var nextMediaId = 0;
  var settings : AppSettings = {
    appName = "My Media Gallery";
    theme = "light";
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Media Management
  public shared ({ caller }) func createMediaItem(input : MediaItem) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only owner can create media items");
    };

    let id = nextMediaId;
    nextMediaId += 1;

    let newItem = {
      input with
      id;
      sortOrder = id;
      createdAt = Time.now();
    };
    mediaItems.add(id, newItem);
    id;
  };

  public shared ({ caller }) func updateMediaItem(id : Nat, mediaItem : MediaItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only owner can update media items");
    };

    if (not mediaItems.containsKey(id)) {
      Runtime.trap("Media item does not exist");
    };

    let newMediaItem = {
      mediaItem with
      id;
      createdAt = Time.now();
    };
    mediaItems.add(id, newMediaItem);
  };

  public shared ({ caller }) func deleteMediaItem(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only owner can delete media items");
    };

    if (not mediaItems.containsKey(id)) {
      Runtime.trap("Media item does not exist");
    };
    mediaItems.remove(id);
  };

  public shared ({ caller }) func reorderMediaItems(orderList : [(Nat, Int)]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only owner can reorder media items");
    };

    for ((id, newOrder) in orderList.values()) {
      switch (mediaItems.get(id)) {
        case (null) { Runtime.trap("Media item does not exist: " # id.toText()) };
        case (?item) {
          let updatedItem = { item with sortOrder = newOrder };
          mediaItems.add(id, updatedItem);
        };
      };
    };
  };

  // App Settings Management
  public shared ({ caller }) func updateAppSettings(newSettings : AppSettings) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only owner can update settings");
    };
    settings := newSettings;
  };

  // Queries - Public read access (no authorization needed)
  public query func getAllMediaItems() : async [MediaItem] {
    mediaItems.values().toArray().sort();
  };

  public query func getAppSettings() : async AppSettings {
    settings;
  };
};
