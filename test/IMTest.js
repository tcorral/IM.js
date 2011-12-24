TestCase("IMSetDebugTest", sinon.testCase({
	setUp: function()
	{

	},
	"test should return false": function()
	{
		var bResult = IM.setDebug(false);

		assertFalse(bResult);
	},
	"test should return true": function()
	{
		var bResult = IM.setDebug(true);

		assertTrue(bResult);
	},
	tearDown: function()
	{

	}
}));

TestCase("IMSetAsynchronousTest", sinon.testCase({
	setUp: function()
	{

	},
	"test should return false if asynchronous is set to false": function()
	{
		var bResult = IM.setAsynchronous(false);

		assertFalse(bResult);
	},
	"test should return true if asynchronous is set to true": function()
	{
		var bResult = IM.setAsynchronous(true);

		assertTrue(bResult);
	},
	tearDown: function()
	{
		
	}
}));

TestCase("IMDataCompareTest", sinon.testCase({
	setUp: function()
	{
		sinon.stub(window, "Date");
	},
	"test should call new Date if nStart is not supplied and bDebug is set to true": function()
	{
		IM.setDebug(true);
		IM.setAsynchronous(false);

		IM.compare([], function(){}, function(){});

		assertEquals(2, window.Date.callCount);
	},
	"test should not call new Date if nStart is not supplied and bDebug is set to false": function()
	{
		IM.setDebug(false);
		IM.setAsynchronous(false);

		IM.compare([], function(){}, function(){});

		assertEquals(0, window.Date.callCount);
	},
	tearDown: function()
	{
		window.Date.restore();
	}
}));

TestCase("IM.Image.ConstructorTest", sinon.testCase({
	setUp: function()
	{

	},
	"test should return an object with src, width and height": function()
	{
		var oImageToCompare = new IM.image('test', 300, 300);

		assertObject(oImageToCompare);
		assertEquals("test?0", oImageToCompare.src);
		assertEquals(300, oImageToCompare.width);
		assertEquals(300, oImageToCompare.height);
	},
	tearDown: function()
	{
		
	}
}));



TestCase("IMCompare2Test", sinon.testCase({
	setUp: function()
	{
		sinon.stub(window, "Date");
	},
	"test should call new Date if nStart is not supplied and bDebug is set to true": function()
	{
		IM.setDebug(true);
		IM.setAsynchronous(false);

		IM.compare(document.body, [], function(){}, function(){});

		assertEquals(3, window.Date.callCount);
	},
	"test should not call new Date if nStart is not supplied and bDebug is set to false": function()
	{
		IM.setDebug(false);
		IM.setAsynchronous(false);

		IM.compare(document.body, [], function(){}, function(){});

		assertEquals(0, window.Date.callCount);
	},
	tearDown: function()
	{
		window.Date.restore();
	}
}));