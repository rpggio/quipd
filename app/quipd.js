Quips = new Mongo.Collection("quips");

var sly;
var activeIndex;
var quipCount;

var initScroll = function() {
  var $frame = $('#slyFrame');
  var $itemsSelector = $frame.children('#quips');
  var $wrap = $frame.parent();

  if (sly) {
    sly.destroy();
  }

  // Call Sly on frame
  sly = new Sly($frame, {
    itemNav: 'forceCentered',
    activateMiddle: true,
    smart: true,
    activateOn: 'click',
    touchDragging: true,
    releaseSwing: true,
    scrollBy: 1,
    activatePageOn: 'click',
    speed: 150,
    elasticBounds: false,
    scrollTrap: true
  }, {
    active: function(method, index) {
      activeIndex = index;
      var item = $itemsSelector.children('li:nth-child(' + (index + 1) + ')');
      var newQuip = item.find('#new-quip-text');
      if(newQuip.length){
        newQuip.focus();
      }
      Session.set("activeIndex", index);
    }
  }).init();
}

var initKeyhandler = function() {
  $(document).keydown(function(e) {
    //console.log('keydown: ' + e.which);
    if(!sly){
      return;
    }
    switch (e.which) {
      case 27: // esc
        $('#new-quip-text').val('');
        break;
      case 35: // end
        if(activeIndex == quipCount) {
          // ignore if on last item
          return;
        }
        sly.toEnd();
        break;
      case 36: // home
        if(activeIndex == quipCount) {
          // ignore if on last item
          return;
        }
        sly.toStart();
        break;
      case 37: // left
        // no-op
        return;
      case 38: // up
        sly.prev();
        break;
      case 39: // right
        // no-op
        return;
      case 40: // down
        sly.next();
        break;
      default:
        return;
    }
    e.preventDefault();
  });
}

var updateScroll = function() {
  if (sly) {
    sly.reload();
    if(quipCount){
      sly.activate(quipCount, true);  // advance to new-quip at index last+1.
    }
  }
}

if (Meteor.isServer) {

  Meteor.startup(function() {

    return Meteor.methods({
      resetQuips: function() {
        Quips.remove({});
        initData();
      }
    });

  });

  Meteor.publish('quipsPub', function(limit) {
    return Quips.find({}, {
      limit: limit || 10,
      sort: {
        createdAt: 1
      }
    });
  });

} else if (Meteor.isClient) {

  var QUIPS_INCREMENT = 30;

  Session.setDefault('quipsLimit', QUIPS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('quipsPub',
      Session.get('quipsLimit'),
      function() {
        quipCount = Quips.find().count();
        updateScroll();
      }
    );
  });

  Template.quipdMain.helpers({
    quips: function() {
      return Quips.find({}, {
          sort: {
            createdAt: 1
          }
        });
    },
    areMoreQuips: function() {
      var quipsCount = Quips.find().count();
      var limit = Session.get("quipsLimit");
      var result = !(quipsCount < limit);
      return result;
    },
    isSelected: function() {
      return this.index === Session.get("activeIndex");
    }
  });

  Template.quipdMain.events({
    'click #showMore': function() {
      Session.set("quipsLimit",
        Session.get("quipsLimit") + QUIPS_INCREMENT);
    },
    'submit #new-quip': function(event) {
      var text = event.target['new-quip-text'].value;
      Quips.insert({
        text: text,
        createdAt: moment().toDate()
      });
      event.target['new-quip-text'].value = "";
      updateScroll();
      return false;
    },
    'click #resetQuips': function() {
      Meteor.call('resetQuips');
    }
  });


  Template.quipdMain.rendered = function() {
    Session.set("quipsLimit", QUIPS_INCREMENT);

    initScroll();

    initKeyhandler();

  };

}


var insertMoment;

var insert = function(text) {
  Quips.insert({
    text: text,
    createdAt: insertMoment.toDate()
  });
  insertMoment = insertMoment.add(1, 'minutes');

}

var initData = function() {
  insertMoment = moment().subtract(1, 'days');
  insert('Men, it has been well said, think in herds; it will be seen that they go mad in herds, while they only recover their senses slowly, one by one.');
  insert("I never lost money by turning a profit.");
  insert("Let us not, in the pride of our superior knowledge, turn with contempt from the follies of our predecessors. The study of the errors into which great minds have fallen in the pursuit of truth can never be uninstructive. As the man looks back to the days of his childhood and his youth, and recalls to his mind the strange notions and false opinions that swayed his actions at the time, that he may wonder at them; so should society, for its edification, look back to the opinions which governed ages that fled.");
  insert("In reading The History of Nations, we find that, like individuals, they have their whims and their peculiarities, their seasons of excitement and recklessness, when they care not what they do. We find that whole communities suddenly fix their minds upon one object and go mad in its pursuit; that millions of people become simultaneously impressed with one delusion, and run after it, till their attention is caught by some new folly more captivating than the first.");
  insert("Many persons grow insensibly attached to that which gives them a great deal of trouble, as a mother often loves her sick and ever-ailing child better than her more healthy offspring.");
  insert("Nations, like individuals, cannot become desperate gamblers with impunity. Punishment is sure to overtake them sooner or later.");
  insert("Three causes especially have excited the discontent of mankind; and, by impelling us to seek remedies for the irremediable, have bewildered us in a maze of madness and error. These are death, toil, and the ignorance of the future..");
  insert("Much as the sage may affect to despise the opinion of the world, there are few who would not rather expose their lives a hundred times than be condemned to live on, in society, but not of it - a by-word of reproach to all who know their history, and a mark for scorn to point his finger at.");
  insert("Dirtbag");
  insert("Crudmiffin");
  insert("Pie hole");
  insert("Rat breath");
  insert("Ear waxer");
  insert("In February 1720 an edict was published, which, instead of restoring the credit of the paper, as was intended, destroyed it irrecoverably, and drove the country to the very brink of revolution...");
  insert("Men, it has been well said, think in herds; it will be seen that they go mad in herds, while they only recover their senses slowly, and one by one.");
  insert("We find that whole communities suddenly fix their minds upon one object, and go mad in its pursuit; that millions of people become simultaneously impressed with one delusion, and run after it, till their attention is caught by some new folly more captivating than the first.");
  insert("Thus did they nurse their folly, as the good wife of Tam O’Shanter did her wrath, “to keep it warm.”");
  insert("Three causes especially have excited the discontent of mankind; and, by impelling us to seek for remedies for the irremediable, have bewildered us in a maze of madness and error. These are death, toil, and ignorance of the future—the doom of man upon this sphere, and for which he shews his antipathy by his love of life, his longing for abundance, and his craving curiosity to pierce the secrets of the days to come. The first has led many to imagine that they might find means to avoid death, or, failing in this, that they might, nevertheless, so prolong existence as to reckon it by centuries instead of units. From this sprang the search, so long continued and still pursued, for the elixir vitæ, or water of life, which has led thousands to pretend to it and millions to believe in it. From the second sprang the absurd search for the philosopher's stone, which was to create plenty by changing all metals into gold; and from the third, the false sciences of astrology, divination, and their divisions of necromancy, chiromancy, augury, with all their train of signs, portents, and omens.");
};