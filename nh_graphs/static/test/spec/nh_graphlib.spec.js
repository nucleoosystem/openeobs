describe('NHGraphlib - Object', function() {
    var graphlib, request;
    beforeEach(function () {
        if(graphlib == null){
            graphlib = new NHGraphLib();
        }
    });

    afterEach(function () {
        if (graphlib != null) {
           graphlib = null;
        }
         var covers = document.getElementsByClassName('cover');
        var body = document.getElementsByTagName('body')[0];
         for(var i = 0; i < covers.length; i++){
	        var cover = covers[i];
	        body.removeChild(cover);
        }
    });

    it('creates a NHGraphLib object with version number', function () {
        expect(graphlib.version).toEqual('0.0.1')
    });

    it('converts date string to date object', function(){
        var date_string = '1988-01-12 06:00:00';
        var date_for_string = graphlib.date_from_string(date_string);
        expect(typeof(date_for_string)).toBe('object');
        expect(date_for_string.constructor.name).toBe('Date');
        expect(date_for_string.toString()).toBe('Tue Jan 12 1988 06:00:00 GMT+0000 (GMT)');
    });

    it('converts date object to string', function(){
        var date = new Date('1988-01-12T06:00:00');
        var string_for_date = graphlib.date_to_string(date);
        expect(string_for_date).toBe('1988-01-12 06:00:00');
    });
});
