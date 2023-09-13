/**************************************************
 * DmSyntax 1.0 - Подсветка синтаксиса (JS версия)
 **************************************************/
(function (global, factory)
{
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
	: typeof define === 'function' && define.amd				 ? define(factory)
	: (global = typeof globalThis !== 'undefined'				 ? globalThis 
	: global || self, global.dmSyntax = factory());
})(this, function ()
{
	'use strict';

	// Встроенные генераторы
	const renders				= {};

	function _tryInit(render, src)
	{
		if (render.init)
		{
			render				= Object.assign({}, render);
			render.init(src);
		}
		return render;
	}

	function _span(css, txt)
	{
		return '<span class="'.concat(css, '">', txt, '</span>');
	}
	
	function _div(css, txt)
	{
		return '<div class="'.concat(css, '">', txt, '</div>');
	}

	function _svgInit(src)
	{
		var lines				= src.split('\n');
		this.rows				= lines.length;
		this.cols				= lines.reduce(function(c, s) { return Math.max(s.length, c); }, 0);
	}

	function _tspan(css, txt)
	{
		return '<tspan class="'.concat(css, '">', txt, '</tspan>');
	}

	function _svgLines(lines)
	{
		for(let l = 0; l<lines.length; l++)
		{
			lines[l]	= '<text y="'.concat(l*15.3333+11.33, '">', lines[l], '</text>');
		}
		return lines.join('');
	}
	
	function _svgGroup(css, id, txt)
	{
		return '<g id="'.concat(id, '" class="', css, '">', txt, '</g>');
	}

	function _svg(css, cols, rows, style, txt)
	{
		const w					= cols*8+1;
		return '<svg xmlns="http://www.w3.org/2000/svg" class="'.concat(css, '" viewbox="0 0 ', w, ' ', rows*15.3333-4, '" width="', w, 'px"><style>text{ font-size: 13.33px; } ', style ,'</style>', txt, '</svg>');
	}
	
	// Генератор HTML
	renders.HTML				= {
		JS:		{
			rem:    function(txt)	{ return _span('rem',  txt); },
			str:    function(txt)	{ return _span('str',  txt); },
			re:     function(txt)	{ return _span('re',   txt); },
			kw:     function(txt)	{ return _span('kw',   txt); },
			gly:    function(txt)	{ return _span('gly',  txt); },
			num:	function(txt)	{ return _span('num',  txt); },
			func:   function(txt)	{ return _span('func', txt); },
			lines:  function(lines)	{ return lines.join('<br/>'); },
			block:  function(txt)	{ return _div('js', txt.replace(/  /g, '  ')); }
		},
		XML:	{
			rem:    function(txt)	{ return _span('rem', txt); },
			cdatao: function()		{ return _span('cdatao', '&lt;![CDATA['); },
			cdata:	function(txt)	{ return _span('cdata', txt); },
			cdatac: function()		{ return _span('cdatac', ']]&gt;'); },
			def:    function(n, p)	{ return _span('tag', '&lt;?'+_span('name', n)).concat(p, _span('tag', '?&gt;')); },
			tago:	function(n, p, e){return _span('tag', '&lt;'+_span('name', n)).concat(p, _span('tag', e ? '/&gt;' : '&gt;')); },
			tagc:	function(n)		{ return _span('tag', '&lt;/'+_span('name', n)+'&gt;'); },
			param:  function(n, v)	{ return _span('attr', _span('name', n)+'="'+_span('value', v)+'"'); },
			lines:  function(lines)	{ return lines.join('<br/>'); },
			block:  function(txt)	{ return _div('xml', txt.replace(/  /g, '  ')); }
		},
		CSS:	{
			rem:    function(txt)	{ return _span('rem', txt); },
			sel:    function(txt)	{ return _span('sel', txt); },
			param:	function(n, v)	{ return _span('name', n)+':'+_span('value', v); },
			lines:  function(lines)	{ return lines.join('<br/>'); },
			block:  function(txt)	{ return _div('css', txt.replace(/  /g, '  ')); }
		}
	};
	renders.HTML.CS				= Object.assign({}, renders.HTML.JS, {
			block:  function(txt)	{ return _div('cs', txt.replace(/  /g, '  ')); }
	});
	renders.HTML.HTML			= {
			XML:	renders.HTML.XML,
			CSS:	renders.HTML.CSS,
			JS:		renders.HTML.JS,
			part:	function(fx, type, src, render) { return fx(src, render); },
			block:  function(txt)	{ return txt; }
	};

	// Генератор SVG
	renders.SVG					= {
		JS:		{
			css:	'.js { font-family: "Courier New", monospace; fill: #000; } .js .rem{ fill: #A0A0A0; } .js .str{ fill: #AA1515;} .js .re { fill: #FF0000; } .js .kw { fill: #0000FF; font-weight: bold; } .js .num { fill: #005700; font-weight: bold; } .js .func { fill: #0000FF; } .js .gly { font-weight: bold; }', 
			init:	_svgInit,
			rem:    function(txt)	{ return _tspan('rem',  txt); },
			str:    function(txt)	{ return _tspan('str',  txt); },
			re:     function(txt)	{ return _tspan('re',   txt); },
			kw:     function(txt)	{ return _tspan('kw',   txt); },
			gly:    function(txt)	{ return _tspan('gly',  txt); },
			num:	function(txt)	{ return _tspan('num',  txt); },
			func:   function(txt)	{ return _tspan('func', txt); },
			lines:  _svgLines,
			block:  function(txt)	{ return _svg('js', this.cols, this.rows, this.css, txt); }
		},
		XML:	{
			css:	'.xml { font-family: "Courier New", monospace; fill: #000; } .xml .rem { fill: #A0A0A0; } .xml .cdatao, .xml .cdatac { fill: #A0A0A0; } .xml .cdata { fill: #000; } .xml .tag { fill: #0000FF; } .xml .name { fill: #AA1515; font-weight: bold; } .xml .attr { fill: #AA1515; } .xml .attr .name { fill: #FF0000; font-weight: normal; } .xml .attr .value { fill: #0000FF; }',
			init:	_svgInit,
			rem:    function(txt)	{ return _tspan('rem', txt); },
			cdatao: function()		{ return _tspan('cdatao', '&lt;![CDATA['); },
			cdata:	function(txt)	{ return _tspan('cdata', txt); },
			cdatac: function()		{ return _tspan('cdatac', ']]&gt;'); },
			def:    function(n, p)	{ return _tspan('tag', '&lt;?'+_tspan('name', n)).concat(p, _tspan('tag', '?&gt;')); },
			tago:	function(n, p, e){return _tspan('tag', '&lt;'+_tspan('name', n)).concat(p, _tspan('tag', e ? '/&gt;' : '&gt;')); },
			tagc:	function(n)		{ return _tspan('tag', '&lt;/'+_tspan('name', n)+'&gt;'); },
			param:  function(n, v)	{ return _tspan('attr', _tspan('name', n)+'="'+_tspan('value', v)+'"'); },
			lines:  _svgLines,
			block:  function(txt)	{ return _svg('xml', this.cols, this.rows, this.css, txt); }
		},
		CSS:	{
			css:	'.css { font-family: "Courier New", monospace; fill: #000; } .css .rem { fill: #A0A0A0; } .css .sel { fill: #AA1515; } .css .name { fill: #FF0000; font-weight: normal; } .css .value { fill: #0000FF; }',
			init:	_svgInit,
			rem:    function(txt)	{ return _tspan('rem', txt); },
			sel:    function(txt)	{ return _tspan('sel', txt); },
			param:	function(n, v)	{ return _tspan('name', n)+':'+_tspan('value', v); },
			lines:  _svgLines,
			block:  function(txt)	{ return _svg('css', this.cols, this.rows, this.css, txt); }
		},
	};
	renders.SVG.CS				= Object.assign({}, renders.SVG.JS, { block: function(txt) { return _svg('cs', this.cols, this.rows, this.css, txt); }, css: '.cs { font-family: "Courier New", monospace; fill: #000; } .cs .rem{ fill: #A0A0A0; } .cs .str{ fill: #AA1515;} .cs .re { fill: #FF0000; } .cs .kw { fill: #0000FF; font-weight: bold; } .cs .num { fill: #005700; font-weight: bold; } .cs .func { fill: #0000FF; } .cs .gly { font-weight: bold; }' });
	renders.SVG.HTML			= {
			css:	renders.SVG.XML.css+renders.SVG.CSS.css+renders.SVG.JS.css,
			init:	function(src) { this.rows = 0; this.cols = 0; this.id = 0; this.defs = []; },
			XML:	Object.assign({}, renders.SVG.XML, { init: null, block: function(txt) { return txt; } }),
			CSS:	Object.assign({}, renders.SVG.CSS, { init: null, block: function(txt) { return txt; } }),
			JS:		Object.assign({}, renders.SVG.JS,  { init: null, block: function(txt) { return txt; } }),
			part:	function(fx, type, src, render)
			{
				const block		= {};
				_svgInit.call(block, src);
				
				this.defs.push(_svgGroup(type, 'b'+this.id, fx(src, render)));
				const result	= '<use href="#b'.concat(this.id, '" y="', this.rows*15.3333, '"/>');

				this.id++;
				this.rows		+= block.rows;
				this.cols		= Math.max(this.cols, block.cols);

				return result;
			},
			block:  function(txt)	{ return _svg('html', this.cols, this.rows, this.css, '<defs>'.concat(this.defs.join(''), '</defs>', txt)); }
	};

	function JS(code, render)
	{
		return _Clike(code, /(\b(?:function|case|if|return|new|switch|var|let|const|this|typeof|for|in|while|break|do|continue|null|true|false)\b|=&gt;)/g, render && render.JS || renders.HTML.JS);
	}
	
	function CS(code, render)
	{
		return _Clike(code, /(\b(?:public|private|protected|internal|readonly|virtual|override|class|using|namespace|void|is|as|string|int|float|double|decimal|foreach|object|enum|interface|static|base|null|case|if|return|new|switch|var|const|this|typeof|for|in|while|break|do|continue|get|set|true|false|value)\b|=&gt;)/g, render && render.CS || renders.HTML.CS);
	}

	function XML(xml, render)
	{
		xml						= _trueTabs(_correctRN(xml));	// Подготовка текста
		render					= _tryInit(render && render.XML || renders.HTML.XML, xml);
		const all				= [];							// Тут собираем все каменты и cdata

		return render.block(
		// Обрабатываем строки
			render.lines(xml
		// Убираем камменты
				.replace(/<!--([\s\S]*?)-->/g,			function(m, t) { return '\0B'+_push(all, _multilineComment('&lt;!--' + _makeSafe(t) + '--&gt;', render.rem))+'\0'; })
		// Убираем CDATA
				.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, function(m, d) { return '\0B'+_push(all, render.cdatao()+_multilineComment(_makeSafe(d), render.cdata)+render.cdatac())+'\0'; })
		// Раскрашиваем тэги
				.replace(/<(((\?)?([a-z][a-z0-9:_-]*)([^>]*)\3)|(\/([a-z][a-z0-9:_-]*)[\s\n]*))>/g, function(m, a, o, d, no, p, c, nc)
					{
						if(d=='?')								// Нашли определение
							return render.def(no, _XMLParam(p, render.param));
						if(nc!=null && nc!='')					// Закрываем тэг
							return render.tagc(nc);
						if(p==null || p=='')					// Открываем тэг без параметров
							return render.tago(no, '', false);
						if(p.substring(p.length-1)=='/')		// Открываем и закрываем тэг без содержимого
							return render.tago(no, _XMLParam(p.substring(0, p.length-1), render.param), true);
						// Открываем тэг
						return render.tago(no, _XMLParam(p, render.param), false);
					})
		// Возвращаем на место каменты, CDATA
				.replace(/\0B(\d+)\0/g, 				function(m, i) { return all[i]; })	
		// Нарезаем строки
				.split('\n')
			)
		);
	}

	function CSS(css, render)
	{
		css						= _trueTabs(_correctRN(css));	// Подготовка текста
		render					= _tryInit(render && render.CSS || renders.HTML.CSS, css);
		const comments			= [];							// Тут собираем все каменты

		return render.block(
		// Обрабатываем строки
				render.lines(
		// Подготовка текста
				_makeSafe(css)
		// Убираем камменты
				.replace(/\/\*([\s\S]*?)\*\//g,			function(m, t) { return '\0C'+_push(comments, _multilineComment(m, render.rem))+'\0'; })
		// Раскрашиваем селекторы
				.replace(/([\.#:]{0,1}[a-z0-9_]+[^\{~\0]*)(\{)([^}]*)(\})/gi, function(m, sel, o, p, c) { return  _multilineComment(sel, render.sel)+o+_CSSParam(p, render.param)+c; })
		// Возвращаем на место каменты
				.replace(/\0C(\d+)\0/g, 				function(m, i) { return comments[i]; })	
		// Нарезаем строки
				.split('\n')
			)
		);
	}

	function HTML(html, render)
	{
		html					= _trueTabs(_correctRN(html));	// Подготовка текста
		render					= _tryInit(render && render.HTML || renders.HTML.HTML, html);
		const all				= [];							// Тут собираем все блоки
		const partsRe			= /<(script|style)([^>]*?)>(?:\s*\n)?([\s\S]*?)[\n]*(\s*<\/\1>)/ig;
		let last				= 0;
		let part				= null;
		while(part = partsRe.exec(html))
		{
			let block			= (part.index>last ? html.substring(last, part.index) : '').concat('<', part[1], part[2], '>');
			all.push(render.part(this.XML, 'xml', block, render));
			switch (part[1])
			{
				case 'style' : all.push(render.part(this.CSS, 'css', part[3], render)); break;
				case 'script': all.push(render.part(this.JS,  'js',  part[3], render)); break;
			}
			last				= part.index+part[0].length-part[4].length;
		}

		if (last<html.length) all.push(render.part(this.XML, 'xml', html.substr(last), render));

		return render.block(all.join(''));
	}

	function _Clike(code, keywords, render)
	{
		code					= _trueTabs(_correctRN(code));	// Подготовка текста
		render					= _tryInit(render, code);
		const all				= [];							// Тут собираем все каменты, строки, RegExp
		const _return			= function(m, i) { return all[i]; };
		// Маскируем HTML
		code					= _makeSafe(code)
			// Убираем regexp и строки
			.replace(/(\/\/[^\n]*)|(\/\*([\s\S]*?)\*\/)|(\/(\\\/|[^\/\n])+\/[gim]{0,3})|(([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*")))/g, function(m, c, mlc, c1, r, d1, d2, f, s)
				{
					if (c) return m;
					if (mlc) return mlc;
					if (r!=null && r!='')
					{
						s		= render.re(r);
						m		= '\0B';
					} else
					{
						s		= render.str(s);
						m		= f+'\0B';
					}
					return m+_push(all, s)+'\0';
				})
			// Убираем многострочные каменты
			.replace(/\/\*([\s\S]*?)\*\//g,				function(m) { return '\0B'+_push(all, _multilineComment(m, render.rem))+'\0'; })
			// Убираем однострочные каменты
			.replace(/([^\\]|^)(\/\/[^\n]*)(\n|$)/g,	function(m, f, t, e) { return f+'\0B'+_push(all, render.rem(t))+'\0'+e; })
			// Выделяем ключевые слова
			.replace(keywords,									render.kw('$1'))
			// Выделяем имена функций
			.replace(/([a-z\_\$][a-z0-9_]*)\s*\(/gi,			render.func('$1')+'(')
			// Выделяем скобки
			.replace(/([{}\[\]\(\)])/g,							render.gly('$1'))
			// Выделяем числа
			.replace(/\b((?:\d[_\d]*(?:\.\d+)?)|(?:0x[\da-f]+))\b/gi, render.num('$1'))
			// Возвращаем на место каменты, строки, RegExp
			.replace(/\0B(\d+)\0/g, 							_return);
		// Обрабатываем строки
		code					= render.lines(code.split('\n'));
		// Финальный аккорд
		return render.block(code);
	}

	// PRIVATE часть
	//===============
	// Список символов для маскирования
	const _safe					= { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
	// Функция замены символов
	function _getSafe(c)
	{
		return _safe[c];
	}
	// Маскировать HTML в строке
	function _makeSafe(txt)
	{
		return txt.replace(/[<>&]/g, _getSafe);
	}
	// В IE из блоков pre вместо \n приходит \r... в других браузерах иногда приходит пара \r\n - все нужно фиксить :(
	function _correctRN(txt)
	{
		return txt.replace(/(\r\n|\r)/g, '\n');
	}
	// Обрабатываем многострочный камент как несколько однострочных
	function _multilineComment(txt, render)
	{
		txt						= txt.split('\n');
		for(let i=0; i<txt.length; i++)
			txt[i]				= render(txt[i]);
		return txt.join('\n');
	}
	// Добавляем элемент и возвращаем его индекс
	function _push(arr, e)
	{
		arr.push(e);
		return arr.length-1;
	}
	// HTML для праметров тегов XML
	function _XMLParam(txt, render)
	{
		return txt.replace(/([a-z][a-z0-9_-]*)[\s\n]*=[\s\n]*"([^"]*)"/g, function(m, n, v) { return render(n, _makeSafe(v)); });
	}
	// HTML для праметров CSS
	function _CSSParam(txt, render)
	{
		return txt.replace(/([^:\n]+):([^;]*)(;)?/g, function(m, n, v, e) { return render(n, v).concat(e==null?'':e); });
	}

	// чем заполняем табы
	let _truetabsstr			= '                             ';
	// поиск табов
	const _truetabsre2			= /^([^\t\n]*)(\t+)/gm;
	// Получаем наполнитель табов нужной длинны
	function _getTrueTabs(len)
	{
		while(len>_truetabsstr.length) _truetabsstr += _truetabsstr;
		return _truetabsstr.substring(0, len);
	}
	// Поиск и замена табов
	function _trueTabs(txt)
	{
		let mached				= true;
		// Пока находим табы - крутимся в цикле
		while(mached)
		{
			mached				= false;
			txt					= txt.replace(_truetabsre2, function(m, text, tabs)
			{
				mached			= true;
				// Внимание! Секретная формула вычисления длинны наполнителя :)
				return text + _getTrueTabs(tabs.length * 4 - text.length % 4);
			});
		}
		return txt;
	}

	return {
		JS		: JS,
		JSON	: JS,
		CS		: CS,
		CSS		: CSS,
		XML		: XML,
		HTML	: HTML,
		renders	: renders
	};
});