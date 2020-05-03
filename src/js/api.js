jadwal_shalat = function(kota){
		var d, card = $(`div[style^=margin-top].card:eq(0)`).find(`div.card-body`);
		card.find(`div[style^=text-align]:eq(0),div.bg-gray:eq(0)`).remove();
		$.ajax({
			url: `http://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=8`, method: `GET`, async:false}).done((data) => {
			d = data.data.timings;
		}).fail(() => {
			d = {'error': true};
		});
                
		if(d.error !== true){
			card.append(`<div style="text-align:center;padding-top:5%;"><span class="label label-success">${kota}</span></div>`);
			var o = $(`<div class="bg-gray" style="text-align:center;"></div>`);
			o.append(`<div class="columns" style="margin-top:3%;"><span class="column col-xs-6 text-primary">Fajar</span><span class="column col-xs-6">${d.Fajr}</span></div>`);
			o.append(`<div class="columns" style="margin-top:3%;"><span class="column col-xs-6 text-primary">Dzhuhr</span><span class="column col-xs-6">${d.Dhuhr}</span></div>`);
			o.append(`<div class="columns" style="margin-top:3%;"><span class="column col-xs-6 text-primary">Ashar</span><span class="column col-xs-6">${d.Asr}</span></div>`);
			o.append(`<div class="columns" style="margin-top:3%;"><span class="column col-xs-6 text-primary">Maghrib</span><span class="column col-xs-6">${d.Maghrib}</span></div>`);
			o.append(`<div class="columns" style="margin-top:3%;"><span class="column col-xs-6 text-primary">Isha</span><span class="column col-xs-6">${d.Isha}</span></div>`);
			o.append(`<div class="columns" style="margin-top:3%;"><span class="column col-xs-6 text-primary">Imsak</span><span class="column col-xs-6">${d.Imsak}</span></div>`);
			card.append(o);
		}else{
			card.append(`<div style="text-align:center;margin-top:2%;"><span class="label label-error">tidak ada result untuk kota <b>${kota}</b></span></div>`);
		}
}



$(document).ready(() => {
	var data_surah;

	$(`div.card:eq(0)`).animate({marginTop: `10%`});

	$(`div[style^=margin-top].card:eq(0)`).find(`div.card-body`).append(() => {
		jadwal_shalat('Majene'); return '';
	});
	$(`button:has(i.icon-search):eq(0)`).click(() => {
		var kota = $(`input[placeholder=Jakarta]`).val();
		jadwal_shalat($.trim(kota));
	});
	$(`button:contains(AL-QUR'AN)`).click(() =>{
		$(`div.card:eq(0),div[style^=margin-top].card`).hide();
		$(`div.container`).append(`<div class="loading loading-lg"></div>`);
			(function(){
		$.ajax(
			{url: `https://al-quran-8d642.firebaseio.com/data.json`,
			method: `GET`}
		).done((data) => {
			 	data_surah = data;
			 	$(`div.container`).find(`div.loading`).remove();
				$(`div.container`).append(`<button class="btn btn-primary tooltip tooltip-right" data-tooltip="back" style="margin-bottom:4%;"><i class="icon icon-arrow-left"></i></button>`);
				$(`div.container`).find(`button:has(i.icon-arrow-left)`).animate({marginTop: `10%`});
			 	$.each(data,(i, surah) => {
			 		$(`div.container`).append(
						`<div data-index="${surah.nomor}" class="card" style="margin-bottom: 10%"><div class="card-body"><div class="columns"><h4 class="column col-xs-6 text-primary">${surah.asma}</h4><h5 class="column col-xs-6 label label-primary">${surah.nama}</h5></div></div><div class="card-footer columns"><small class="column col-xs-11 text-secondary">${surah.arti}</small><span class="col-xs-1 label label-secondary">${surah.nomor}</span></div></div>`
			 		);
			 	});
		}).fail((eror) => {
			 	alert(`ada kesalahan ..`);
			 	$(`div.container`).find(`div.loading`).remove();
				$(`div.card:eq(0),div[style^=margin-top].card`).show();
		});
			})();
	});

	$(document).on(`click`, 'div[data-index]', function(){
		var i = parseInt($(this).attr(`data-index`));
		var d = data_surah[i-1];
		$.ajax(
			{url:`https://al-quran-8d642.firebaseio.com/surat/${i}.json`,
			 method: `GET`})
		.done((data) => {
			$(document).find(`div[data-index]`).remove();
			$(`div.container`).append(`<div class="card mt-2" style="margin-bottom:5%;"><div class="card-body"></div></div>`);
			$(`div.container`).find(`div.card-body:eq(2)`).append(
				`<div class="columns label label-secondary" style="margin-bottom:15%;"><div class="column col-xs-7 col-mr-auto h4">${d.nama}</div><small class="column col-xs-2 col-mr-auto text-gray">${d.type}</small><button class="column col-xs-2 btn btn-primary tooltip tooltip-top" data-url="${d.audio}" data-tooltip="putar ayat">play</button><small style="display:none;">${d.keterangan}</small></div>`
			);
			$.each(data, (i, datax) => {
				$(`div.card-body:eq(2)`).append(
					`<div class="columns bg-gray" style="margin-bottom:10%;"><span class="column col-xs-1 label label-primary">${datax.nomor}</span><div class="column columns"><span class="column col-xs-12 h3" style="text-align:right;margin-bottom:4%;">${datax.ar}</span><small class="column col-xs-12 text-dark" style="margin-bottom:3%;">${datax.tr}</small><span class="column col-xs-12 label label-secondary ">${datax.id}</span></div></div>`
				);
			});
		});
	});
	$(document).on(`click`,`button:has(i.icon)`, function(){
		$(`div.card:eq(0),div[style^=margin-top].card`).show();
		
		if($(document).find(`button:contains(play),button:contains(stop)`).length){
			$(document).find(`div.card:eq(2)`).remove();
			$(`div.container`).find(`button:contains(AL-QUR'AN)`).click();
		}
		$(`div.container > *:not(div.card:eq(0)):not(div[style^=margin-top].card):not(div.loading)`).remove();

	});

	$(document).on(`click`,`div.card-body:eq(2):has(button:contains(play),button:contains(stop))`, function(){
		$(document).find(`small:eq(1)`).toggle();
	});

	$(document).on(`click`,`button:contains(play),button:contains(stop)`,function(){
		var x = $(this).attr(`data-url`);
		if($.trim($(this).text()) === `play`){
			$(document.body).append(`<audio><source src="${x}" type="audio/mp3"></source></audio>`);
			$(this).text(`stop`);
			$(document.body).find(`audio`)[0].play();
		}else{
			$(this).text(`play`);
			$(document).find(`audio`).remove();
		}
	});
});

