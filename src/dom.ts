//const x = document.createElement('div')

function dom() {
  function html(value?: string) {
    //element:HTMLElement,
    if (value) {
      console.log(value, " :value");

      /*const html = value.replace(/<!--.*?-->/gis, ' ')
			.replace(/<script.*?<\/script>/gis, ' ')
			.replace(/<style.*?<\/style>/gis, ' ')
			.replace(/\s+/gis, ' ')
			*/

      //	const css = value.match(/<style(.*?)<\/style>/gis)

      const js = value.match(/<script.*?>.*?<\/script>/gis);

      console.log(js, " :css");
    }

    return ""; //element.innerHTML
  }

  const api = {
    html,
  };

  return api;
}

const string = `
<div>
	<!--hiii-->
	<!---->
	<!-- -->
	<!--

	-->

	<style>

	hii
	</style>

  div  hio
  <script type="text/javascript" charset="utf-8">
    console.log('hoi')
  </script>
<style type="text/css" media="all">
  *{
    background: red;
  }
</style>
</div>
`;

const _t = dom();

const _u = _t.html(string);

console.log(_u);
