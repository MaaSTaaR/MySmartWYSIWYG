(function( $ ) {
	var editorDoc;
	var commands = [];
	
	$.fn.MySmartEditor = function() 
	{
		initEditor( this );
	}
	
	this.getEditorDoc = function()
	{
		return this.editorDoc;
	}
	
	this.getSelectedLines = function()
	{
		var selection = getEditorDoc().getSelection();
		var range = selection.getRangeAt( 0 );
		
		var text = selection.toString();
		
		return text.split( "\n" );
	}
	
	this.addTagToText = function( textLines, tag )
	{
		var newContainer = getEditorDoc().createElement( "span" );
		
		newContainer.appendChild( document.createTextNode( "[" + tag + "]" ) );
		newContainer.appendChild( document.createElement( "br" ) );
		
		var lines = textLines;
		
		for ( var k = 0; k < lines.length; k++ )
		{
			newContainer.appendChild( document.createTextNode( lines[ k ] ) );
			newContainer.appendChild( document.createElement( "br" ) );
		}
		
		newContainer.appendChild( document.createTextNode( "[/" + tag + "]" ) );
		
		getEditorDoc().execCommand( "insertHTML", false, newContainer.innerHTML );
	}
	
	this.initEditor = function( parent )
	{
		initCommandsList();
		initToolbar( parent );
		initWorkingSpace( parent );
		implementToolbarCommands();
	}
	
	this.initCommandsList = function()
	{
		var k = 0;
		
		commands[ k++ ] = { name: "Bold",
							type: "cmd",
							css_class: "bold",
							callback: function() 
							{
								getEditorDoc().execCommand( 'bold', false, null );
							} };
		
		commands[ k++ ] = { name: "Italic",
							type: "cmd",
							css_class: "italic",
							callback: function() 
							{
								getEditorDoc().execCommand( 'italic', false, null );
							} };
		
		commands[ k++ ] = { name: "Underline",
							type: "cmd",
							css_class: "underline",
							callback: function() 
							{
								getEditorDoc().execCommand( 'underline', false, null );
							} };
		
		commands[ k++ ] = { type: "seperator" };
		
		commands[ k++ ] = { name: "Link",
							type: "cmd",
							css_class: "link",
							callback: function() 
							{
								// TODO
							} };
		
		commands[ k++ ] = { name: "Image",
							type: "cmd",
							css_class: "image",
							callback: function() 
							{
								// TODO
							} };
		
		commands[ k++ ] = { type: "seperator" };
		
		commands[ k++ ] = { name: "Code",
							type: "cmd",
							css_class: "code",
							callback: function() 
							{
								addTagToText( getSelectedLines(), "code" );
							} };
		
		commands[ k++ ] = { name: "Quote",
							type: "cmd",
							css_class: "quote",
							callback: function() 
							{
								addTagToText( getSelectedLines(), "quote" );
							} };

		commands[ k++ ] = { type: "seperator" };
		
		commands[ k++ ] = { name: "Font Family",
							type: "list",
							id: "font_family",
							callback: function( parent ) 
							{
								getEditorDoc().execCommand( 'fontName', false, parent.val() );
							},
							insertData: function() 
							{ 
								$( "#font_family" ).append( '<option selected="selected" value="fontfamily_title">Font-family</option>' );
								$( "#font_family" ).append( '<option value="Arial">Arial</option>' );
								$( "#font_family" ).append( '<option value="Tahoma">Tahoma</option>' );
							}};
		
		commands[ k++ ] = { name: "Font Color",
							type: "list",
							id: "font_color",
							callback: function( parent ) 
							{
								getEditorDoc().execCommand( 'foreColor', false, parent.val() );
							},
							insertData: function() 
							{ 
								$( "#font_color" ).append( '<option selected="selected" value="fontcolor_title">Font-color</option>' );
								$( "#font_color" ).append( '<option value="#ff0000" style="color: #ff0000;">Red</option>' );
								$( "#font_color" ).append( '<option value="#0000ff" style="color: #0000ff;">Blue</option>' );
							}};
		
		commands[ k++ ] = { name: "Font Size",
							type: "list",
							id: "font_size",
							callback: function( parent ) 
							{
								getEditorDoc().execCommand( 'fontSize', false, parent.val() );
							},
							insertData: function() 
							{ 
								$( "#font_size" ).append( '<option selected="selected" value="fontsize_title">Font-size</option>' );
								$( "#font_size" ).append( '<option value="1">1</option>' );
								$( "#font_size" ).append( '<option value="2">2</option>' );
								$( "#font_size" ).append( '<option value="3">3</option>' );
								$( "#font_size" ).append( '<option value="4">4</option>' );
								$( "#font_size" ).append( '<option value="5">5</option>' );
							}};
	}
	
	this.initToolbar = function( parent )
	{
		toolbar = $( '<div id="toolbar"><ul></ul></div><br /><div id="toolbar_option"></div>' );
		
		parent.append( toolbar );
		
		$( "#toolbar_option" ).hide();
		
		for ( var k = 0; k < commands.length; k++ )
		{
			var command = commands[ k ];
			
			if ( command.type == "cmd" )
			{
				$( "#toolbar ul" ).append( '<li class="' + command.css_class + ' cmd"></li>' );
				
				$( "." + command.css_class ).on( 'click', command.callback );
			}
			else if ( command.type == "list" )
			{
				$( "#toolbar ul" ).append( '<li class="list"><select name="' + command.id + '_n" id="' + command.id + '"></select></li>' );
				
				command.insertData();
				
				$( "#" + command.id ).on( 'change',
						function() 
						{
							command.callback( $( this ) );
							
							$( this ).prop( "selectedIndex", 0 ); 
						} );
			}
			else
			{
				$( "#toolbar ul" ).append( '<li class="seperator"></li>' );
			}
		}
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
		/*$( ".bold" ).on( "click", function() { getEditorDoc().execCommand( 'bold', false, null ); } );
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
			addTagToText( getSelectedLines(), "code" );
		} );
		
		$( ".quote" ).on( "click", function() 
		{
			addTagToText( getSelectedLines(), "quote" );
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
		} );*/
	}
})(jQuery);