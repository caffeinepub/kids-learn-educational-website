import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    poems : Map.Map<Nat, OldPoem>;
    stories : Map.Map<Nat, OldStory>;
    educationalModules : Map.Map<Nat, OldEducationalModule>;
    games : Map.Map<Nat, OldGame>;
    nextPoemId : Nat;
    nextStoryId : Nat;
    nextModuleId : Nat;
    nextGameId : Nat;
  };

  type OldPoem = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    ageGroup : Text;
    imageUrl : Text;
  };

  type OldStory = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    ageGroup : Text;
    readingTime : Nat;
    coverImageUrl : Text;
  };

  type OldEducationalModule = {
    id : Nat;
    title : Text;
    description : Text;
    contentType : Text;
    learningItems : [Text];
  };

  type OldGame = {
    id : Nat;
    title : Text;
    description : Text;
    gameType : Text;
    imageUrl : Text;
  };

  type NewActor = {
    poems : Map.Map<Nat, Poem>;
    stories : Map.Map<Nat, Story>;
    educationalModules : Map.Map<Nat, EducationalModule>;
    games : Map.Map<Nat, Game>;
    nextPoemId : Nat;
    nextStoryId : Nat;
    nextModuleId : Nat;
    nextGameId : Nat;
  };

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

  public func run(old : OldActor) : NewActor {
    let poems = old.poems.map<Nat, OldPoem, Poem>(
      func(_id, old) {
        {
          old with
          image = null;
          ageGroup = switch (old.ageGroup) {
            case ("ages3to5") { #ages3to5 };
            case ("ages6to8") { #ages6to8 };
            case ("ages9to12") { #ages9to12 };
            case ("allAges") { #allAges };
            case (_) { #allAges };
          };
        };
      }
    );
    let stories = old.stories.map<Nat, OldStory, Story>(
      func(_id, old) {
        {
          old with
          coverImage = null;
          ageGroup = switch (old.ageGroup) {
            case ("ages3to5") { #ages3to5 };
            case ("ages6to8") { #ages6to8 };
            case ("ages9to12") { #ages9to12 };
            case ("allAges") { #allAges };
            case (_) { #allAges };
          };
        };
      }
    );
    let games = old.games.map<Nat, OldGame, Game>(
      func(_id, old) {
        { old with image = null };
      }
    );
    {
      old with
      poems;
      stories;
      games;
    };
  };
};
