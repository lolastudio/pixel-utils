import { LitElement, html, css } from '/web_modules/lit-element.js';

class SvgLoader extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
		.spinner {
		  -webkit-animation: rotation 1s linear infinite;
		  animation: rotation 1s linear infinite;
		}
		
		@-webkit-keyframes rotation {
		  0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		  }
		
		  100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		@keyframes rotation {
		  0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		  }
		
		  100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		.circle {
		  stroke-dasharray: 187;
		  stroke-dashoffset: 0;
		  -webkit-transform-origin: center;
		  -ms-transform-origin: center;
		  transform-origin: center;
		  -webkit-animation: turn 1.4s ease-in-out infinite;
		  animation: turn 1.4s ease-in-out infinite;
		}
		
		@-webkit-keyframes turn {
		  0% {
			stroke-dashoffset: 180;
		  }
		
		  50% {
			stroke-dashoffset: 45;
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		  }
		
		  100% {
			stroke-dashoffset: 180;
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		@keyframes turn {
		  0% {
			stroke-dashoffset: 180;
		  }
		
		  50% {
			stroke-dashoffset: 45;
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		  }
		
		  100% {
			stroke-dashoffset: 180;
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		  }
		}
		
		svg{
			stroke: #fffbd1;
		}
		`;
	}

	render() {
		return html`
			<svg class="spinner" width="66px" height="66px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
				<circle class="circle" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
			</svg>
		`;
	}
}

customElements.define('svg-loader', SvgLoader);

export default SvgLoader;
