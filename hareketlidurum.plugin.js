{"name":"HareketliDurum"}*//

class AnimatedStatus {
	
	getName () {
		return "HareketliDurum";
	}

	getVersion () {
		return "0.3";
	}

	getAuthor () {
		return "Asreaper";
	}

	getDescription () {
		return "Discord Durumunuzu Hareketli Yapın.";
	}

	setData (key, value) {
		BdApi.setData(this.getName(), key, value);
	}

	getData (key) {
		return BdApi.getData(this.getName(), key);
	}

	
	load () {
		this.animation = this.getData("animation");
		this.timeout = this.getData("timeout");
		Status.authToken = this.getData("token");
	}

	start () {
		if (this.animation == undefined || this.timeout == undefined || Status.authToken == undefined) return;
		this.Status_Animate();
	}

	stop () {
		clearTimeout(this.loop);
		Status.unset();
	}

	Status_Animate (index = 0) {
		if (index >= this.animation.length) index = 0;
	
		Status.set(this.animation[index]);
		this.loop = setTimeout(() => { this.Status_Animate(index + 1); }, this.timeout);
	}

	
	strToAnimation (str) {
		let lines = str.split("\n");
		let out = [];
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].length == 0) continue;

			out.push(JSON.parse("[" + lines[i] + "]"));
		}
		return out;
	}

	animationToStr (animation) {
		if (animation == undefined) return ""

		let out = "";
		for (let i = 0; i < animation.length; i++) {
			out += JSON.stringify(animation[i]).substr(1).slice(0, -1) + "\n";
		}
		return out;
	}

	getSettingsPanel () {
		let settings = document.createElement("div");
		settings.style.padding = "10px";

		// Auth token
		settings.appendChild(GUI.newLabel("AuthToken (https://discordhelp.net/discord-token)"));
		let token = GUI.newInput();
		token.value = this.getData("Hesap Token");
		settings.appendChild(token);

		settings.appendChild(GUI.newDivider());

		// gecikme
		settings.appendChild(GUI.newLabel("Değişim Süresi | 1000 = 1SN"));
		let timeout = GUI.newInput();
		timeout.value = this.getData("timeout");
		settings.appendChild(timeout);

		settings.appendChild(GUI.newDivider());

		// Animasyon
		settings.appendChild(GUI.newLabel('Animation ("" for no Emoji)'));
		let animation = GUI.newTextarea();
		animation.style.fontFamily = "SourceCodePro,Consolas,Liberation Mono,Menlo,Courier,monospace";
		animation.placeholder = '"Message 1", "Emoji 1"\n"Message 2", ""\n...';
		animation.value = this.animationToStr(this.getData("animation"));
		settings.appendChild(animation);

		// kaydet
		settings.appendChild(GUI.newDivider());
		let save = GUI.newButton("Kaydet");
		save.onclick = () => {
			//  Hesap Token
			this.setData("token", token.value);

			//  Gecikme
			this.setData("timeout", timeout.value);

			//  Animasyon
			this.setData("animation", this.strToAnimation(animation.value));

			this.stop();
			this.load();
			this.start();
		};
		settings.appendChild(save);

		// Bitiş
		return settings;
	}
}

/* API */
const Status = {
	authToken: "",

	request: () => {
		let req = new XMLHttpRequest();
		req.open("PATCH", "/api/v6/users/@me/settings", true);
		req.setRequestHeader("authorization", Status.authToken);
		req.setRequestHeader("content-type", "application/json");
		return req;
	},

	set: (status) => {
		Status.request().send('{"custom_status":{"text":"' + status[0] + '", "emoji_name": "' + status[1] + '"}}');
	},

	unset: () => {
		Status.request().send('{"custom_status":null}');
	}
};

const GUI = {
	newInput: () => {
		let input = document.createElement("input");
		input.className = "inputDefault-_djjkz input-cIJ7To";
		return input;
	},

	newLabel: (text) => {
		let label = document.createElement("h5");
		label.className = "h5-18_1nd";
		label.innerText = text;
		return label;
	},

	newDivider: () => {
		let divider = document.createElement("div");
		divider.style.paddingTop = "15px";
		return divider;
	},

	newTextarea: () => {
		let textarea = document.createElement("textarea");
		textarea.className = "input-cIJ7To scrollbarGhostHairline-1mSOM1";
		textarea.style.resize = "vertical";
		textarea.rows = 4;
		return textarea;
	},

	newButton: (text) => {
		let button = document.createElement("button");
		button.className = "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn"; 
		button.innerText = text;
		return button;
	}
};
