var cheerio = require('cheerio');

describe('angular-dragon-drop', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
    ptor.get('http://localhost:8001/test/page.html');
    ptor.executeScript(
      "document.title = 'Test: " +
      jasmine.getEnv().currentSpec.description +
      "';"
    );
  });

  var assertListElementsEqual = function (id, values) {
    ptor.findElement(protractor.By.id(id + 'Div'))
    .getInnerHtml()
    .then(function(html) {
      var $ = cheerio.load(html);

      expect($('#' + id + 'Values').text()).toEqual(values.join(','));

      var liValues = $('li').map(function() { return $(this).text(); });
      expect(liValues).toEqual(values);
    });
  };

  var dragAndDropItem = function(srcId, dstId) {
    ptor.findElement(protractor.By.id(srcId))
    .then(function(srcElem) {
      ptor.findElement(protractor.By.id(dstId))
      .then(function(dstElem) {
        new protractor.ActionSequence(ptor.driver)
        .mouseMove(srcElem)
        .mouseDown()
        .mouseMove(dstElem)
        .mouseUp()
        .perform();
      });
    });
  };

  it('initializes the lists based on scope data', function() {
    assertListElementsEqual('things', ['Foo', 'Bar', 'Baz']);
    assertListElementsEqual('otherThings', []);
    assertListElementsEqual('copyableThings', ['Paper', 'Right']);
    assertListElementsEqual('noBeeThings', ['Nose']);
  });

  it('moves items between lists when dragged', function() {
    dragAndDropItem('itemBar', 'otherThingsList');
    assertListElementsEqual('otherThings', ['Bar']);
    assertListElementsEqual('things', ['Foo', 'Baz']);
  });

  it('reappends items to their own list when dragged to nowhere', function() {
    dragAndDropItem('itemBar', 'boring');
    assertListElementsEqual('things', ['Foo', 'Baz', 'Bar']);
    assertListElementsEqual('otherThings', []);
  });

  it('can move an item back to its original list', function() {
    dragAndDropItem('itemBar', 'otherThingsList');
    dragAndDropItem('itemBar', 'thingsList');
    assertListElementsEqual('things', ['Foo', 'Baz', 'Bar']);
    assertListElementsEqual('otherThings', []);
  });

  it('copies items with btf-double-dragon', function() {
    dragAndDropItem('itemPaper', 'otherThingsList');
    assertListElementsEqual('copyableThings', ['Paper', 'Right']);
    assertListElementsEqual('otherThings', ['Paper']);
  });

  it('limits accepted items with btf-dragon-accepts', function() {
    dragAndDropItem('itemPaper', 'noBeeThingsList');
    assertListElementsEqual('noBeeThings', ['Nose', 'Paper']);
    dragAndDropItem('itemBar', 'noBeeThingsList');
    assertListElementsEqual('noBeeThings', ['Nose', 'Paper']);
    dragAndDropItem('itemFoo', 'noBeeThingsList');
    assertListElementsEqual('noBeeThings', ['Nose', 'Paper', 'Foo']);
  });
});
