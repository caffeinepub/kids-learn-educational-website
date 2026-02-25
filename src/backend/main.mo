import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Migration "migration";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  type AgeGroup = {
    #ages3to5;
    #ages6to8;
    #ages9to12;
    #allAges;
  };

  type Poem = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    ageGroup : AgeGroup;
    image : ?Storage.ExternalBlob;
  };

  type Story = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    ageGroup : AgeGroup;
    readingTime : Nat;
    coverImage : ?Storage.ExternalBlob;
  };

  type EducationalModule = {
    id : Nat;
    title : Text;
    description : Text;
    contentType : Text;
    learningItems : [Text];
  };

  type Game = {
    id : Nat;
    title : Text;
    description : Text;
    gameType : Text;
    image : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  module Poem {
    public func compare(poem1 : Poem, poem2 : Poem) : Order.Order {
      switch (Text.compare(poem1.title, poem2.title)) {
        case (#equal) { Nat.compare(poem1.id, poem2.id) };
        case (order) { order };
      };
    };
  };

  module Story {
    public func compare(story1 : Story, story2 : Story) : Order.Order {
      switch (Text.compare(story1.title, story2.title)) {
        case (#equal) { Nat.compare(story1.id, story2.id) };
        case (order) { order };
      };
    };
  };

  module EducationalModule {
    public func compare(module1 : EducationalModule, module2 : EducationalModule) : Order.Order {
      switch (Text.compare(module1.title, module2.title)) {
        case (#equal) { Nat.compare(module1.id, module2.id) };
        case (order) { order };
      };
    };
  };

  module Game {
    public func compare(game1 : Game, game2 : Game) : Order.Order {
      switch (Text.compare(game1.title, game2.title)) {
        case (#equal) { Nat.compare(game1.id, game2.id) };
        case (order) { order };
      };
    };
  };

  let poems = Map.empty<Nat, Poem>();
  let stories = Map.empty<Nat, Story>();
  let educationalModules = Map.empty<Nat, EducationalModule>();
  let games = Map.empty<Nat, Game>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextPoemId = 1;
  var nextStoryId = 1;
  var nextModuleId = 1;
  var nextGameId = 1;

  // Access Control State
  let accessControlState = AccessControl.initState();

  // Include authorization
  include MixinAuthorization(accessControlState);

  // Include blob storage for images
  include MixinStorage();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
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

  // Poems
  public shared ({ caller }) func addPoem(
    title : Text,
    content : Text,
    author : Text,
    ageGroup : AgeGroup,
    image : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add poems");
    };

    let poem : Poem = {
      id = nextPoemId;
      title;
      content;
      author;
      ageGroup;
      image;
    };
    poems.add(nextPoemId, poem);
    nextPoemId += 1;
    poem.id;
  };

  public query func getPoem(id : Nat) : async Poem {
    switch (poems.get(id)) {
      case (null) { Runtime.trap("Poem not found") };
      case (?poem) { poem };
    };
  };

  public query func listPoems() : async [Poem] {
    poems.values().toArray().sort();
  };

  public query func listPoemsByAgeGroup(ageGroup : AgeGroup) : async [Poem] {
    let filtered = poems.values().filter(
      func(poem) { poem.ageGroup == ageGroup }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func updatePoem(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    ageGroup : AgeGroup,
    image : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update poems");
    };

    switch (poems.get(id)) {
      case (null) { Runtime.trap("Poem not found") };
      case (?_) {
        let updatedPoem : Poem = {
          id;
          title;
          content;
          author;
          ageGroup;
          image;
        };
        poems.add(id, updatedPoem);
      };
    };
  };

  public shared ({ caller }) func deletePoem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete poems");
    };

    if (not poems.containsKey(id)) {
      Runtime.trap("Poem not found");
    };
    poems.remove(id);
  };

  // Stories
  public shared ({ caller }) func addStory(
    title : Text,
    content : Text,
    author : Text,
    ageGroup : AgeGroup,
    readingTime : Nat,
    coverImage : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add stories");
    };

    let story : Story = {
      id = nextStoryId;
      title;
      content;
      author;
      ageGroup;
      readingTime;
      coverImage;
    };
    stories.add(nextStoryId, story);
    nextStoryId += 1;
    story.id;
  };

  public query func getStory(id : Nat) : async Story {
    switch (stories.get(id)) {
      case (null) { Runtime.trap("Story not found") };
      case (?story) { story };
    };
  };

  public query func listStories() : async [Story] {
    stories.values().toArray().sort();
  };

  public query func listStoriesByAgeGroup(ageGroup : AgeGroup) : async [Story] {
    let filtered = stories.values().filter(
      func(story) { story.ageGroup == ageGroup }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func updateStory(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    ageGroup : AgeGroup,
    readingTime : Nat,
    coverImage : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update stories");
    };

    switch (stories.get(id)) {
      case (null) { Runtime.trap("Story not found") };
      case (?_) {
        let updatedStory : Story = {
          id;
          title;
          content;
          author;
          ageGroup;
          readingTime;
          coverImage;
        };
        stories.add(id, updatedStory);
      };
    };
  };

  public shared ({ caller }) func deleteStory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete stories");
    };

    if (not stories.containsKey(id)) {
      Runtime.trap("Story not found");
    };
    stories.remove(id);
  };

  // Educational Modules
  public shared ({ caller }) func addEducationalModule(
    title : Text,
    description : Text,
    contentType : Text,
    learningItems : [Text],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add educational modules");
    };

    let educationalModule : EducationalModule = {
      id = nextModuleId;
      title;
      description;
      contentType;
      learningItems;
    };
    educationalModules.add(nextModuleId, educationalModule);
    nextModuleId += 1;
    educationalModule.id;
  };

  public query func getEducationalModule(id : Nat) : async EducationalModule {
    switch (educationalModules.get(id)) {
      case (null) { Runtime.trap("Module not found") };
      case (?educationalModule) { educationalModule };
    };
  };

  public query func listEducationalModules() : async [EducationalModule] {
    educationalModules.values().toArray().sort();
  };

  public shared ({ caller }) func updateEducationalModule(
    id : Nat,
    title : Text,
    description : Text,
    contentType : Text,
    learningItems : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update educational modules");
    };

    switch (educationalModules.get(id)) {
      case (null) { Runtime.trap("Module not found") };
      case (?_) {
        let updatedModule : EducationalModule = {
          id;
          title;
          description;
          contentType;
          learningItems;
        };
        educationalModules.add(id, updatedModule);
      };
    };
  };

  public shared ({ caller }) func deleteEducationalModule(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete educational modules");
    };

    if (not educationalModules.containsKey(id)) {
      Runtime.trap("Module not found");
    };
    educationalModules.remove(id);
  };

  // Games
  public shared ({ caller }) func addGame(
    title : Text,
    description : Text,
    gameType : Text,
    image : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add games");
    };

    let game : Game = {
      id = nextGameId;
      title;
      description;
      gameType;
      image;
    };
    games.add(nextGameId, game);
    nextGameId += 1;
    game.id;
  };

  public query func getGame(id : Nat) : async Game {
    switch (games.get(id)) {
      case (null) { Runtime.trap("Game not found") };
      case (?game) { game };
    };
  };

  public query func listGames() : async [Game] {
    games.values().toArray().sort();
  };

  public shared ({ caller }) func updateGame(
    id : Nat,
    title : Text,
    description : Text,
    gameType : Text,
    image : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update games");
    };

    switch (games.get(id)) {
      case (null) { Runtime.trap("Game not found") };
      case (?_) {
        let updatedGame : Game = {
          id;
          title;
          description;
          gameType;
          image;
        };
        games.add(id, updatedGame);
      };
    };
  };

  public shared ({ caller }) func deleteGame(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete games");
    };

    if (not games.containsKey(id)) {
      Runtime.trap("Game not found");
    };
    games.remove(id);
  };

  // Image Management
  public shared ({ caller }) func uploadImage(image : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload images");
    };
    image;
  };
};

