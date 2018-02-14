export default function open(link) {
	return e => {
		e.preventDefault();
		if (window) {
			const n = 768;
			const r = 400;
			const i = (window.innerHeight - r) / 2;
			const s = (window.innerWidth - n) / 2;
			const popup = window.open(link, "_blank", `height=${r},width=${n},top=${i},left=${s}`);
			if (window.focus) {
				popup.focus();
			}
		}
	};
}
