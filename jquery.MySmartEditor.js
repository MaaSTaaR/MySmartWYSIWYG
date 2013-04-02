(function( $ ) {
	var editorDoc;
	
	$.fn.MySmartEditor = function() 
	{
		initEditor( this );
	}
	
	this.getEditorDoc = function()
	{
		return this.editorDoc;
	}
	
	this.initEditor = function( parent )
	{
		initToolbar( parent );
		initWorkingSpace( parent );
		implementToolbarCommands();
	}
	
	this.initToolbar = function( parent )
	{
		toolbar = $( '<div id="toolbar"><ul></ul></div><br /><div id="toolbar_option"></div>' );
		
		parent.append( toolbar );
		
		$( "#toolbar_option" ).hide();
		
		$( "#toolbar ul" ).append( '<li class="bold cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="italic cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="underline cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="seperator"></li>' );
		$( "#toolbar ul" ).append( '<li class="link cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="image cmd"></li>' )
		$( "#toolbar ul" ).append( '<li class="seperator"></li>' );;
		$( "#toolbar ul" ).append( '<li class="code cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="quote cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="seperator"></li>' );;
		$( "#toolbar ul" ).append( '<li class="list"><select name="font_family_n" id="font_family"><option selected="selected" value="fontfamily_title">Font-family</option><option value="Arial">Arial</option><option value="Tahoma">Tahoma</option></select></li>' );
		$( "#toolbar ul" ).append( '<li class="list"><select name="font_color_n" id="font_color"><option selected="selected" value="fontcolor_title">Font-color</option><option value="#ff0000" style="color: #ff0000;">Red</option><option value="#0000ff" style="color: #0000ff;">Blue</option></select></li>' );
		$( "#toolbar ul" ).append( '<li class="list"><select name="font_size_n" id="font_size"><option selected="selected" value="fontsize_title">Font-size</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></li>' );
	}
	
	this.initWorkingSpace = function( parent )
	{
		var editorFrame = $( '<iframe id="editor_frame"></iframe>' );
		editorFrame.addClass( "editor" );
		
		parent.append( editorFrame );
		
		var element = editorFrame.get( 0 )
		
		this.editorDoc = element.contentDocument;
		
		this.editorDoc.designMode = 'on';
		this.editorDoc.open();
		
		this.editorDoc.write( '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ar"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><link type="text/css" href="MySmartEditor.css" rel="stylesheet" /></head><body class="editor_text"></body></html>' );
		
		this.editorDoc.close();
		
		element.contentWindow.focus();
	}
	
	this.implementToolbarCommands = function()
	{
		$( ".bold" ).on( "click", function() { getEditorDoc().execCommand( 'bold', false, null ); } );
		$( ".italic" ).on( "click", function() { getEditorDoc().execCommand( 'italic', false, null ); } );
		$( ".underline" ).on( "click", function() { getEditorDoc().execCommand( 'underline', false, null ); } );
		$( ".link" ).on( "click", function() 
		{
			$( "#option_content" ).remove();
			$( "#toolbar_option" ).append( '<span id="option_content">Link : <input type="text" id="link" /><input type="button" id="insert_link" value="Insert"></span>' );
			$( "#toolbar_option" ).fadeToggle(); 
			
			$( "#insert_link" ).on( "click", function() {
				getEditorDoc().execCommand( 'createlink', false, $( "#link" ).val() );
				$( "#toolbar_option" ).fadeToggle( 400, "swing", function() { $( "#option_content" ).remove(); } );
			});
		} );
		
		$( ".image" ).on( "click", function() 
		{ 
			$( "#option_content" ).remove();
			$( "#toolbar_option" ).append( '<span id="option_content">Image\'s Link : <input type="text" id="link" /><input type="button" id="insert_image" value="Insert"></span>' );
			$( "#toolbar_option" ).fadeToggle(); 
		
			$( "#insert_image" ).on( "click", function() {
				getEditorDoc().execCommand( 'insertImage', false, $( "#link" ).val() );

				$( "#toolbar_option" ).fadeToggle( 400, "swing", function() { $( "#option_content" ).remove(); } );
			});
		} );
		
		$( ".code" ).on( "click", function() 
		{
			var selection = getEditorDoc().getSelection();
			var range = selection.getRangeAt( 0 );
			
			var text = selection.toString();
			
			var codeContainer = getEditorDoc().createElement( "span" );
			
			codeContainer.appendChild( document.createTextNode( "[code]" ) );
			codeContainer.appendChild( document.createElement( "br" ) );
			
			var lines = text.split( "\n" );
			
			for ( var k = 0; k < lines.length; k++ )
			{
				codeContainer.appendChild( document.createTextNode( lines[ k ] ) );
				codeContainer.appendChild( document.createElement( "br" ) );
			}
			
			codeContainer.appendChild( document.createTextNode( "[/code]" ) );
			
			getEditorDoc().execCommand( "insertHTML", false, codeContainer.innerHTML );
			
		} );
		
		$( ".quote" ).on( "click", function() 
		{ 			
			var selection = getEditorDoc().getSelection();
			var range = selection.getRangeAt( 0 );
			
			var text = selection.toString();
			
			var codeContainer = getEditorDoc().createElement( "span" );
			
			codeContainer.appendChild( document.createTextNode( "[quote]" ) );
			codeContainer.appendChild( document.createElement( "br" ) );
			
			var lines = text.split( "\n" );
			
			for ( var k = 0; k < lines.length; k++ )
			{
				codeContainer.appendChild( document.createTextNode( lines[ k ] ) );
				codeContainer.appendChild( document.createElement( "br" ) );
			}
			
			codeContainer.appendChild( document.createTextNode( "[/quote]" ) );
			
			getEditorDoc().execCommand( "insertHTML", false, codeContainer.innerHTML );
		} );
		
		$( "#font_family" ).on( "change", function() 
		{
			getEditorDoc().execCommand( 'fontName', false, $( this ).val() );
			
			$( "#font_family" ).prop( "selectedIndex", 0 );
		});
		
		$( "#font_color" ).on( "change", function() 
		{
			getEditorDoc().execCommand( 'foreColor', false, $( this ).val() );
			
			$( "#font_color" ).prop( "selectedIndex", 0 );
		});
		
		$( "#font_size" ).on( "change", function() 
		{
			getEditorDoc().execCommand( 'fontSize', false, $( this ).val() );
			
			$( "#font_size" ).prop( "selectedIndex", 0 );
		});
		
		$( "#show_html" ).on( "click", function() 
		{ 
			alert( getEditorDoc().body.innerHTML );
		} );
	}
})(jQuery);