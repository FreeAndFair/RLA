
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
	  xmlns:pref="http://www.w3.org/2002/Math/preference"
      pref:renderer="css">

<head>
<link rel="shortcut icon" href="../Pics/vote.ico"/>
<link rel="shortcut icon" href="../../Pics/vote.ico"/>
<link rel="stylesheet" type="text/css" href="../../pbsDefault.css"/>
<link rel="stylesheet" type="text/css" href="../pbsDefault.css"/>


<script language="JavaScript1.4" type="text/javascript"><!--
	pageModDate = "Thursday 14 November 2013 13:15:59 PST";
	// copyright 2011&ndash;2012 by P.B. Stark, statistics.berkeley.edu/~stark.
    // All rights reserved.
// -->
</script>

<script type="text/javascript" src="../../Java/Jquery/Current/jquery.min.js"></script>
<script type="text/javascript" src="../../Java/Jquery/Current/jquery.flot.js"></script>
<script type="text/javascript" src="../../Java/Jquery/Current/sha256.js"></script>
<script type="text/javascript" src="../../Java/Jquery/Current/BigInt.js"></script>

<script type="text/javascript" src="../Java/Jquery/Current/jquery.min.js"></script>
<script type="text/javascript" src="../Java/Jquery/Current/jquery.flot.js"></script>
<script type="text/javascript" src="../Java/Jquery/Current/sha256.js"></script>
<script type="text/javascript" src="../Java/Jquery/Current/BigInt.js"></script>

<script type="text/javascript"><!--

   $(document).ready(function(){
      // Starting sample size notes
      $("a.toggleStartingSampleNotes").click(function(){
                                                         $(".startingSampleNotes").toggle();
                                                         if ($("a.toggleStartingSampleNotes").text() == 'Show technical notes.') {
                                                             $("a.toggleStartingSampleNotes").text('Hide technical notes.');
                                                         } else {
                                                             $("a.toggleStartingSampleNotes").text('Show technical notes.');
                                                         }
                                                         return(false);
                                                        }
                                            );
      // Ending sample size notes
      $("a.toggleEndingSampleNotes").click(function(){
                                                         $(".endingSampleNotes").toggle();
                                                         if ($("a.toggleEndingSampleNotes").text() == 'Show technical notes.') {
                                                             $("a.toggleEndingSampleNotes").text('Hide technical notes.');
                                                         } else {
                                                             $("a.toggleEndingSampleNotes").text('Show technical notes.');
                                                         }
                                                         return(false);
                                                        }
                                            );
      // Random sampling notes
      $("a.toggleRandomSampleNotes").click(function(){
                                                         $(".randomSampleNotes").toggle();
                                                         if ($("a.toggleRandomSampleNotes").text() == 'Show technical notes.') {
                                                             $("a.toggleRandomSampleNotes").text('Hide technical notes.');
                                                         } else {
                                                             $("a.toggleRandomSampleNotes").text('Show technical notes.');
                                                         }
                                                         return(false);
                                                        }
                                            );
      $(".notes").hide();
      $(".notes").css({color:"#333", 'font-size':"80%", 'margin-left':"5%", 'background-color':'#eee'});
      $("#hideAllProse").click(function(){$("p:not(form p),pre:not(form pre),table:not(form table),ul:not(form ul),li:not(form li),#visualizing,#placeholder,#plotTitle,#considerations" ).toggle();$(".notes").hide();$("#hideAll").show();});

      // set up the first contest
      addContest();
      $("#addContestButton").click(function(){addContest();});
      $("#removeContestButton").click(function(){removeContest();});
      $("input[type=text]").focus(function(){this.select();});
      $("#addBallotButton").click(function(){addBallot();});
      $("#removeBallotButton").click(function(){removeBallot();});
      $("#roundUp1").change(function(){sampleSizeEst();findNmin();});
      $("#roundUp2").change(function(){sampleSizeEst();findNmin();});
      $("#startSize").click(function(){sampleSizeEst();findNmin();});
      $("#byMargin").change(function(){plotSample();});
      $("#placeholder").bind("plothover", function (event, pos, item) {
         $("#x").text(pos.x.toFixed(2));
         $("#y").text(pos.y.toFixed(2));
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    if ($("#byMargin").prop('checked')) {
                        var x = item.datapoint[0].toFixed(0),
                            y = item.datapoint[1].toFixed(0);

                        showTooltip(item.pageX, item.pageY,
                                item.series.label + " with " + x + " 1-vote overstatements, final sample size is " + y);
                    } else {
                        var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(0);
                        showTooltip(item.pageX, item.pageY,
                                "for " + item.series.label + " and margin " + x + "%, expected sample size is " + y);
                    }
                }
            }
    });

    $("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
            plot.highlight(item.series, item.datapoint);
        }
    });
    plotSample();
    }
    )

    var previousPoint = null;
    var mars =     [0.005,    .01,    .05,    .1,    .2];
    var maxErrs = 30;
    var errRates = [0,     0.0001,  0.001,    0.01];
    var marStep = 0.5;
    var maxMar = 30;
    var data = new Array();

    function plotSample() {
        if ($("#byMargin").prop('checked')) {
            data = new Array(mars.length);
            for (var j = 0; j < mars.length; j++) {
                data[j] = [];
            }
            var maxy = 0;
            for (var i = 0; i <= maxErrs; i += 1) {
                for (var j=0; j < mars.length; j++) {
                     var s = nmin(alpha, gamma, mars[j], i, 0, 0, 0);
                     maxy = Math.max(maxy, s);
                     data[j].push([i, s]);
                }
            }
            var plot = $.plot($("#placeholder"),
                   [ { data: data[0], label: "margin " + roundToDig(100*mars[0], 1).toString() + "%"} ,
                     { data: data[1], label: "margin " + roundToDig(100*mars[1], 1).toString() + "%"} ,
                     { data: data[2], label: "margin " + roundToDig(100*mars[2], 1).toString() + "%"} ,
                     { data: data[3], label: "margin " + roundToDig(100*mars[3], 1).toString() + "%"} ,
                     { data: data[4], label: "margin " + roundToDig(100*mars[4], 1).toString() + "%"}
                   ], {
                       series: {
                           lines: { show: true },
                           points: { show: true }
                       },
                       grid: { hoverable: true, clickable: true },
                       xaxis: { min: -0.5, max: maxErrs + 1 },
                       yaxis: { min: -1, max: maxy+1 },
                       legend: { position: "nw" }
                     });
            $("#plotTitle").text("Final sample size as a function of observed number of 1-vote overstatements, 10% risk limit");
        } else {
            data = new Array(errRates.length);
            for (var j = 0; j < errRates.length; j++) {
                data[j] = [];
            }
            var maxy = 0;
            for (var m = marStep; m <= maxMar; m += marStep) {
                for (var j=0; j < errRates.length; j++) {
                     if (m/100 > errRates[j]) {
                         var s = nminFromRates(alpha, gamma, m/100, errRates[j], 0, 0, 0, true, true);
                         maxy = Math.max(maxy, s);
                         data[j].push([m, s]);
                     }
                }
            }
            var plot = $.plot($("#placeholder"),
                   [ { data: data[0], label: "1-vote overstatement rate " + roundToDig(100*errRates[0], 2).toString() + "%"} ,
                     { data: data[1], label: "1-vote overstatement rate " + roundToDig(100*errRates[1], 2).toString() + "%"} ,
                     { data: data[2], label: "1-vote overstatement rate " + roundToDig(100*errRates[2], 2).toString() + "%"} ,
                     { data: data[3], label: "1-vote overstatement rate " + roundToDig(100*errRates[3], 2).toString() + "%"}
                   ], {
                       series: {
                           lines: { show: true },
                           points: { show: true }
                       },
                       grid: { hoverable: true, clickable: true },
                       xaxis: { min: -0.5, max: maxMar + 1 },
                       yaxis: { min: -1, max: maxy+1 },
                       legend: { position: "ne" }
                     });
            $("#plotTitle").text("Expected sample size as a function of the diluted margin, 10% risk limit");
        }
    }

    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }


// ------------------------------------
        var candidates = [];
        var errBallots = [];
        var names = [];
        var ballots;

		function addContest() {
		    candidates.push([]);
		    names.push([]);
		    var conStr = (candidates.length-1).toString();
		    var str = '<hr align="left" id="hrCon' + conStr + '"><div class="contest" id="contest' + conStr + '" contest="' + conStr + '">' +
		              '<span class="label">Contest ' + candidates.length.toString() +
		              '.&nbsp;&nbsp;</span>' +
		              '<label for="contestName' + conStr + '">Contest name: </label>' +
		              '<input type="text" size="80" id="contestName' + conStr + '" class="contestName" /><br />' +
		              '<label for="voteForContest' + conStr +  '">Winners:&nbsp;</label>' +
		              '<select id="voteForContest' + conStr + '" onchange="updateVotes();">' +
		                 '<option value="1">1</option>' +
		                 '<option value="2">2</option>' +
		                 '<option value="3">3</option>' +
		                 '<option value="4">4</option>' +
		                 '<option value="5">5</option>' +
		                 '<option value="6">6</option>' +
		                 '<option value="7">7</option>' +
		                 '<option value="8">8</option>' +
		                 '<option value="9">9</option>' +
		                 '<option value="10">10</option>' +
		              '</select><p><span class="label">Reported votes:</span></p></div><br />' +
		              '<div class="addCandidate" id="addCandidate' + conStr + '" contest="' + conStr + '">' +
		              '<input type="button" id="addCandidateButton' + conStr +
		              '" value="Add candidate to contest ' + candidates.length.toString() +
		              '" contest="' + conStr + '"/>' +
		              '<input type="button" id="removeCandidateButton' + conStr +
		              '" value="Remove last candidate from contest ' + candidates.length.toString() +
		              '" contest="' + conStr + '"/></div>';
		    $(".contestList").append(str);
		    $("#contest" + (candidates.length-1).toString()).append(addCandidate(candidates.length-1));
            $("#contest" + (candidates.length-1).toString()).append(addCandidate(candidates.length-1));
		    var conRef = "#contest" + conStr;
		    var candRefLast = '.candidate.contest' + candidates.length + ':last';
		    var thisContest = candidates.length-1;
		    $("#contestName" + conStr).blur(function(){names[conStr][0] = this.value;});
		    $("#addCandidateButton" + conStr).click(function(){$(conRef).append(addCandidate(conStr));updateVotes();});
		    $("#removeCandidateButton" + conStr).click(function(){$(candRefLast).remove();
		                                                          candidates[thisContest].pop();
		                                                          names[thisContest].pop();
		                                                          updateVotes();}
		                                              );
		    return(true);
		}

		function removeContest() {
		    var conStr = (candidates.length-1).toString();
		    $("#hrCon" + conStr).remove();
		    $("#contest" + conStr).remove();
		    $("#addCandidateButton" + conStr).remove();
		    $("#removeCandidateButton" + conStr).remove();
		    candidates.pop();
		    names.pop();
		    return(true);
		}


		function addCandidate(contest) {
            candidates[contest].push(0);
		    var theCandidate = (parseInt(contest)+1).toString() + '_' + candidates[contest].length.toString();
		    return('<div class="candidate contest' + (parseInt(contest)+1).toString() + '" ' +
		           'id="candidate_' +  theCandidate + '">' +
		           '<label for="name' + theCandidate + '">Candidate ' + candidates[contest].length +  ' Name: </label> ' +
		           '<input type="text" size="40" id="name' + theCandidate + '" onblur="names[' + contest + '][' +
		              (candidates[contest].length-1) + ']=this.value;" />' +
		           '<label for="nBallots' + theCandidate + '">&nbsp;&nbsp;Votes: ' + '</label>' +
		           '<input type="text" size="10" id="nBallots' + theCandidate + '" onblur="updateVotes()"/></div>');
		}

	function addBallot() {
		    ballots.push([]);
		    var balStr = (ballots.length-1).toString();
		    var str = '<hr align="left" id="hrBal' + balStr + '"><div class="ballot" id="ballot' + balStr + '" ballot="' + balStr + '">' +
		              '<span class="label">Ballot ' + ballots.length.toString() +
		              '.&nbsp;&nbsp;</span>' +
		              '<p><span class="label">Contests on ballot ' + ballots.length.toString() +
		                 ' with differences:</span></p></div><br />' +
		              '<div class="addErrContest" id="addErrContest' + balStr + '" ballot="' + balStr + '">' +
		              '<input type="button" id="addErrContestButton' + balStr +
		              '" value="Add discrepant contest to ballot ' + ballots.length.toString() +
		              '" ballot="' + balStr + '"/>' +
		              '<input type="button" id="removeErrContestButton' + balStr +
		                  '" value="Remove last contest from ballot ' + ballots.length.toString() +
		                  '" ballot="' + balStr + '"/></div>';
		    $("#ballotErrList").append(str);
		    var balRef = '#ballot' + balStr;
            var balRefLast = '.ballot.contest' + ballots.length + ':last';
		    var thisBallot = "#ballot" + balStr;
		    $("#addErrContestButton" + balStr).click(function(){$(balRef).append(addErrContest(balStr));updateErrors();});
		    $("#removeErrContestButton" + balStr).click(function(){$(balRefLast).remove();updateErrors();});
		    return(true);
		}


		function removeBallot() {
		    var balStr = (ballots.length-1).toString();
		    $("#hrBal" + balStr).remove();
		    $("#ballot" + balStr).remove();
		    $("#addErrContestButton" + balStr).remove();
		    $("#removeErrContestButton" + balStr).remove();candidates.pop();
		    ballots.pop();
		    return(true);
		}


        function updateErrors() {
            return(true);
        }

		var hasher;
		var sample = new Array(3);
		sample[0] = new Array();
		sample[1] = new Array();
		sample[2] = new Array();

		function hashMe() {
			hasher = new jsSHA($("#seedValue").val() + "," +
			                   $("#samNum").val(), "ASCII");
			$("#nObj").val(parseInt($("#nObj").val()));
			if ($("#nObj").val() == 'NaN') {
			    $("#nObj").val(1);
			}
			try {
			    sample[0].push($("#samNum").val());
				sample[1].push(hasher.getHash("SHA-256", "HEX"));
				sample[2].push(1 +
			                     modInt( str2bigInt(hasher.getHash("SHA-256", "HEX"), 16, 0),
			                              parseInt($("#nObj").val())
			                           )
			                   );
                writeList();
                $("#sortedList").val(sample[2].slice().sort(numberLessThan).join(','));
                $("#ballotList").val($("#sortedList").val());
                var deDupeList = sortMultiple(sample[2], numberLessThan);
                $("#sortedDedupeList").val(deDupeList[0].join(','));
                if (vMinMax(deDupeList[1])[1] > 1) {
                     $("#duplicates").val('Ballot, multiplicity\n' + arrayToString(findRepeats(deDupeList)));
                }
            } catch(e) {
			}
		}

        function writeList() {
            if ($("#showSequence").prop('checked') &
                   $("#showHash").prop('checked') ) {
                $("#list").val('sequence_number, hash value, ballot\n' + arrayToString(sample));
            } else if ($("#showSequence").prop('checked')) {
                $("#list").val('sequence_number, ballot\n' + arrayToString([sample[0],sample[2]]));
            } else if ($("#showHash").prop('checked')) {
                $("#list").val('hash, ballot\n' + arrayToString([sample[1],sample[2]]));
            } else {
                $("#list").val(sample[2].join(','));
            }
            return(true);
        }



		function startMe() {
		    clearList();
		    hashMe();
		}

		function clearList() {
		    sample = new Array(3);
		    sample[0] = new Array();
		    sample[1] = new Array();
		    sample[2] = new Array();
		    $("#list").val('');
		    $("#sortedList").val('');
		    $("#sortedDedupeList").val('');
		    $("#ballotList").val('');
		    $("#duplicates").val('');
		}

		function resetMe() {
		    clearList();
		    $("#samNum").val('0');
        }

		function nextSample() {
		    for (var i=0; i < parseInt($("#samMany").val()); i++) {
		        $("#samNum").val(parseInt($("#samNum").val()) + 1);
		        hashMe();
		        $("#sizeSoFar").text('Ballots audited so far: ' + sample[0].length.toString());
		    }
		}

    gamma = 1.03905;
    alpha = 0.1;


    function nmin(alpha, gamma, m, o1, o2, u1, u2) {
        return(Math.max(
                    o1+o2+u1+u1,
                    Math.ceil(-2*gamma*( Math.log(alpha) +
                                         o1*Math.log(1-1/(2*gamma)) +
                                         o2*Math.log(1 - 1/gamma) +
                                         u1*Math.log(1+1/(2*gamma)) +
                                         u2*Math.log(1+1/gamma)) / m
                             )
                        )
                );
    }


/*    function nminFrac(alpha, gamma, m, o1, o2, u1, u2) {
        return(Math.ceil(-2*gamma*(Math.log(alpha) + o1*Math.log(1-1/(2*gamma)) +
              o2*Math.log(1 - 1/gamma) + u1*Math.log(1+1/(2*gamma)) + u2*Math.log(1+1/gamma)) / m));
    }
*/

    function nminFromRates(alpha, gamma, m, r1, r2, s1, s2, roundUp1, roundUp2) {
        var n0 = -2*gamma*Math.log(alpha) /
                      (m + 2*gamma*(r1*Math.log(1-1/(2*gamma)) +
                       r2*Math.log(1 - 1/gamma) + s1*Math.log(1+1/(2*gamma)) + s2*Math.log(1+1/gamma))
                      );
        var o1, o2, u1, u2;
        for (var i=0; i < 3; i++) {
            if (roundUp1) {
                 o1 = Math.ceil(r1*n0);
                 u1 = Math.ceil(s1*n0);
            } else {
                 o1 = Math.round(r1*n0);
                 u1 = Math.round(s1*n0);

            }
            if (roundUp2) {
                 o2 = Math.ceil(r2*n0);
                 u2 = Math.ceil(s2*n0);
            } else {
                 o2 = Math.round(r2*n0);
                 u2 = Math.round(s2*n0);
            }
            n0 = nmin(alpha, gamma, m, o1, o2, u1, u2);
        }
        return(n0);
    }


    var minMargin;

    function findMinMargin() {
        ballots = parseInt($("#nBallots").val());
        if (candidates.length > 0) {
               minMargin = ballots;
        } else {
            minMargin = Number.NaN;
        }
        var ballOk = !isNaN(ballots);
        var opsOk = true;
        var votesOk = true;
        try {
            for (var i=0; i < candidates.length; i++) {
               var cani = parseInt($("#voteForContest" + i.toString()).val());
               if (candidates[i].length < cani ) {
                   opsOk = false;
               }
               for (var j=0; j < candidates[i].length; j++) {
                   candidates[i][j] = parseInt($("#nBallots" + (i+1).toString() + '_' + (j+1).toString()).val());
               }
               if (vSum(candidates[i]) > cani*ballots) {
                   votesOk = false;
               }
               var dum = candidates[i].slice().sort(numberLessThan).reverse();
               minMargin = Math.min(minMargin, dum[cani-1] - dum[cani]);
               for (var j=0; j < candidates[i].length; j++) {
                   var theCandidate = (i+1).toString() + '_' + (j+1).toString();
                   if (candidates[i][j] > dum[cani]) {
                        $("#candidate_" + theCandidate).css('backgroundColor', '#5e5');
                   } else {
                        $("#candidate_" + theCandidate).css('backgroundColor', '');
                   }
               }
            }
        } catch(e) {
           minMargin = 'undefined';
           alert(e);
        }
        if (!opsOk | isNaN(minMargin)) {
            minMargin = 'undefined';
            $("#theDilutedMargin").text('Diluted margin: undefined.');
            $("#theMargin").text('Smallest margin (votes): undefined. ');
        } else {
            $("#theMargin").text('Smallest margin (votes): ' + commify(minMargin) + '. ');
            $("#theDilutedMargin").text(' Diluted margin: ' + commify(doubleToStr(100*minMargin/ballots,2)) + '%. ');
        }
        return(opsOk & votesOk & ballOk);
    }

    function updateVotes() {
        clearSampleSizes();
        findMinMargin();
        return(true);
    }

    function clearSampleSizes() {
        $('#startSampleSize').html('&hellip;');
        $('#stopSampleSize').html('&hellip;');
        $('#auditComplete').html('&nbsp;Audit incomplete&nbsp;');
        $('#auditComplete').css('backgroundColor','#E55');
        return(true);
    }

    function sampleSizeEst() {
        var n = Number.NaN;
        if (!findMinMargin()) {
           try {
               for (var i=0; i < candidates.length; i++) {
                   var vf = parseInt($("#voteForContest" + i.toString()).val());
                   if (candidates[i].length <  vf ) {
                       throw 'Fewer candidates than voting opportunities in contest ' + (i+1).toString() + '!';
                   }
                   if (vSum(candidates[i]) > vf*ballots) {
                       throw 'More votes than voting opportunities in contest ' + (i+1).toString() + '!';
                   }
                   if (isNaN(parseInt($("#nBallots").val()))) {
                       throw 'Total number of ballots must be specified!';
                   }
               }
           } catch(e) {
               $("#startSampleSize").html('&hellip;');
               alert(e);
           }
        } else if (parseInt(minMargin) > 0) {
            try {
              var m = minMargin/parseInt($("#nBallots").val());
              var risk = parsePercent($("#risk").val());
              var r1 = $("#rateOneOver").val();
              var r2 = $("#rateTwoOver").val();
              var s1 = $("#rateOneUnder").val();
              var s2 = $("#rateTwoUnder").val();
              n = nminFromRates(risk, gamma, m, r1, r2, s1, s2, $("#roundUp1").prop('checked'), $("#roundUp2").prop('checked'));
              $("#startSampleSize").text(' ' + n.toString() + '.');
              $("#samMany").val(n.toString());
            } catch(e) {
               alert(e);
            }
        } else {
              $("#startSampleSize").html('&hellip;');
              $("#samMany").val(0);
        }
    }

    function findNmin() {
        var n = Number.NaN;
        var nf = Number.NaN;
        if (!findMinMargin()) {
           try {
               for (var i=0; i < candidates.length; i++) {
                   var vf = parseInt($("#voteForContest" + i.toString()).val());
                   if (candidates[i].length <  vf ) {
                       throw 'Fewer candidates than voting opportunities in contest ' + (i+1).toString() + '!';
                   }
                   if (vSum(candidates[i]) > vf*ballots) {
                       throw 'More votes than voting opportunities in contest ' + (i+1).toString() + '!';
                   }
               }
           } catch(e) {
               clearStops();
               alert(e);
           }
        } else if (parseInt(minMargin) > 0) {
            try {
              var m = minMargin/parseInt($("#nBallots").val());
              var risk = parsePercent($("#risk").val());
              var o1 = parseInt($("#oneOver").val());
              var o2 = parseInt($("#twoOver").val());
              var u1 = parseInt($("#oneUnder").val());
              var u2 = parseInt($("#twoUnder").val());
              var samSize = $('#samNum').val();
              if (samSize > 0) {
                  var r1 = o1/samSize;
                  var r2 = o2/samSize;
                  var s1 = u1/samSize;
                  var s2 = u2/samSize;
                  $('#obsRateOneOver').html('Rate: ' + doubleToStr(r1,4));
                  $('#obsRateTwoOver').html('Rate: ' + doubleToStr(r2,4));
                  $('#obsRateOneUnder').html('Rate: ' + doubleToStr(s1,4));
                  $('#obsRateTwoUnder').html('Rate: ' + doubleToStr(s2,4));
                  n = nmin(risk, gamma, m, o1, o2, u1, u2);
                  nf = nminFromRates(risk, gamma, m, r1, r2, s1, s2, $("#roundUp1").prop('checked'), $("#roundUp2").prop('checked'));
                  $("#stopSampleSize").text(' If no more differences are observed: ' + n.toString() + '. ');
                  $("#estStopSampleSize").html(' If differences continue at the same rates: ' + nf.toString() + '. ');
                  $("#additionalBallots").html(' Estimated additional ballots if difference rates stay the same: ' + Math.max(0, nf - n).toString() + '.');
                  if (samSize >= n) {
                       $('#auditComplete').html('&nbsp;Audit complete&nbsp;');
                       $('#auditComplete').css('backgroundColor','#5E5');
                  }
               } else {
                  $('#obsRateOneOver').html('Rate: &hellip; ');
                  $('#obsRateTwoOver').html('Rate: &hellip; ');
                  $('#obsRateOneUnder').html('Rate: &hellip; ');
                  $('#obsRateTwoUnder').html('Rate: &hellip; ');
                  n = nmin(risk, gamma, m, o1, o2, u1, u2);
                  $("#stopSampleSize").text(' If no more differences are observed: ' + n.toString() + '. ');
                  $("#estStopSampleSize").html(' If differences continue at the same rates: &hellip; . ');
                  $("#additionalBallots").html(' Estimated additional ballots if difference rates stay the same: &hellip; .');
                  $('#auditComplete').html('&nbsp;Audit incomplete&nbsp;');
                 $('#auditComplete').css('backgroundColor','#E55');
               }
            } catch(e) {
               alert(e);
            }
        } else {
              clearStops();
        }
    }

    function clearStops() {
         $("#stopSampleSize").html(' If no more differences are observed: &hellip;');
         $("#estStopSampleSize").html(' If differences continue at the same rates: &hellip; . ');
         $("#additionalBallots").html('Estimated additional ballots if difference rates stay the same: &hellip; ');
         $('#auditComplete').html('&nbsp;Audit incomplete&nbsp;');
         $('#auditComplete').css('backgroundColor','#E55');
    }


    function lookUpBallots(whichBallots, sort) {
        for (var i=0; i < whichBallots.length; i++) {
           whichBallots[i] = parseInt(whichBallots[i]);  // the ballots to find
        }
        if (parseManifest()) {
           if (vSum(manifest[1]) != $("#nObj").val()) {
                alert('Error: Number of ballots in the manifest, ' + vSum(manifest[1]).toString() +
                      ' is not equal to the number of ballots in the contest, ' + $("#nObj").val() +'!');
                return(Number.NaN);
            } else if (vMinMax(whichBallots)[1] > vSum(manifest[1])) {
                alert('Error: Requested ballot exceeds the number of ballots in the manifest!');
                return(Number.NaN);
            } else if (vMinMax(whichBallots)[0] < 1) {
                alert('Error: Requested ballot number is negative!');
                return(Number.NaN);
            }
            var manCum = new Array(manifest[0].length);  // cumulative number of ballots in batches
            manCum[0] = 0;
            for (var i=1; i < manifest[0].length; i++) {
               manCum[i] = manCum[i-1] + manifest[1][i-1];
            }
            var lookUp = new Array(3); // ballot (absolute numbering), batch, identifier_in_batch
            lookUp[0] = whichBallots;
            lookUp[1] = new Array(whichBallots.length);
            lookUp[2] = new Array(whichBallots.length);
            for (var i = 0; i < whichBallots.length; i++) {
                var j = 0;
                while (manCum[j] < whichBallots[i]) {
                    j++;
                }
                j--;
                lookUp[1][i] = manifest[0][j];
                if (typeof(manifest[2][j]) == 'object') {
                    lookUp[2][i] = manifest[2][j][whichBallots[i] - manCum[j] - 1];
                } else {
                    lookUp[2][i] = whichBallots[i] - manCum[j] + manifest[2][j] - 1;
                }
            }
            var str = 'sorted_number, ballot, batch_label, which_ballot_in_batch\n';
            for (var i=0; i < lookUp[0].length; i++ ) {
                str += (i+1).toString() + ', ' + lookUp[0][i].toString() + ', ' +
                       lookUp[1][i].toString() + ', ' + lookUp[2][i].toString() + '\n';
            }
        } else {
            str = 'The manifest cannot be parsed.\n' +
                  'Be sure that the each line of the manifest consists of a batch label followed by a comma and a number or ' +
                  'a colon-separated ballot range or a list of identifiers in parentheses. ' +
                  'There must be exactly one comma per line.\n';
            $("#manifest").val(str + $("#manifest").val());
        }
        $("#lookUp").val(str);
    }

var manifest = null;

    function parseManifest() {
        var stuff = $("#manifest").val().replace(/\n+/gi,'\n').split('\n');
        var grabBagRegExp = /^ *\(.+\) *$/i
        var batches = new Array(3);
        batches[0] = new Array();  // batch labels
        batches[1] = new Array();  // number of ballots in the batch
        batches[2] = new Array();  // number of the first ballot in the batch, or an array of identifiers
        success = true;
        var j = 0;
        for (var i=0; i < stuff.length; i++) {
            if (typeof(stuff[i]) == 'undefined' || stuff[i] == null || stuff[i] == '') {
               continue;
            } else if (stuff[i].indexOf(',') < 0) {
               alert('Error! Line ' + (i+1).toString() + ' of the manifest has no commas: ' +
                      stuff[i].toString());
               success = false;
            }  else {
               var dum = stuff[i].split(',');
               if (dum.length != 2) {
                   alert('Error! Line ' + (i+1).toString() + ' of the manifest does not parse: ' +
                         stuff[i].toString() +
                         ' Be sure it has exactly one comma, separating the label from the number ' +
                         'of ballots or the ballot range.' );
                   success = false;
               } else {
                   batches[0][j] = dum[0];
                   if (dum[1].indexOf(':') >=  0) {
                         var mRange = dum[1].split(':');
                         batches[1][j] = parseInt(mRange[1]) - parseInt(mRange[0]) + 1;
                         batches[2][j] = parseInt(mRange[0]);
                   } else if (grabBagRegExp.test(dum[1])) {
                         batches[2][j] = new Array();
                         batches[2][j] = dum[1].replace(/( *\( *| *\) *)/g,'').replace(/ +/g,' ').split(' ');
                         batches[1][j] = batches[2][j].length;
                   } else {
                         batches[1][j] = parseInt(dum[1]);
                         batches[2][j] = 1;
                   }
                   j++;
               }
            }
        }
        if (success) {
            manifest = batches;
        } else {
            manifest = null;
        }
        return(success);
    }

//  General-purpose utilities

        function numberLessThan(a,b) { // numerical ordering for javascript sort function
            var diff = parseFloat(a)-parseFloat(b);
            if (diff < 0) {
                return(-1);
            } else if (diff == 0) {
               return(0);
            } else {
               return(1);
            }
         }

        function sortMultiple(list,order) { // sort a list, tabulate multiplicity of items. list is unchanged
            var ans = null;
            if (list.length > 0) {
                var temp = list.slice();
                if (typeof(order) != 'undefined' && order != null) {
                   temp.sort(order);
                } else {
                   temp.sort();
                }
                ans = new Array(2);
                ans[0] = new Array();
                ans[1] = new Array();
                ans[0][0] = temp[0];
                ans[1][0] = 1;
                for (var i=1; i < temp.length; i++) {
                   if (temp[i] == ans[0].slice(-1)) {
                       ans[1][ans[1].length-1]++;
                   } else {
                       ans[0].push(temp[i]);
                       ans[1].push(1);
                   }
                }
            }
            return(ans);
        }

        function findRepeats(list) { // find elements with multiplicity greater than one
                                     // in an array generated by sortMultiple()
            var ans = new Array(2);
            ans[0] = new Array();
            ans[1] = new Array();
            for (var i = 0; i < list[0].length; i++) {
                if (list[1][i] > 1) {
                   ans[0].push(list[0][i]);
                   ans[1].push(list[1][i]);
                }
            }
            return(ans);
        }

        function arrayToString(arr) { // formats an array
            var str = '';
            var cols = arr.length;
            var rows = arr[0].length;
            for (var j=0; j < rows; j++) {
                for (var i=0; i < cols; i++) {
                    str+= arr[i][j] + ',';
                }
                str = str.replace(/,$/,'\n');
            }
            return(str);
        }

    function vCum(list) { // vector of cumulative sum
        var list2 = list;
        for (var i = 1; i < list.length; i++ ) {
            list2[i] += list2[i-1];
        }
        return(list2);
    }

    function vMinMax(list){ // returns min and max of list
        var mn;
        var mx;
        if (list.length == 'undefined' || list.length == 0) {
           mn = list;
           mx = list;
        } else {
           mn = list[0];
           mx = list[0];
           for (var i=1; i < list.length; i++) {
               if (mn > list[i]) mn = list[i];
               if (mx < list[i]) mx = list[i];
           }
        }
        var vmnmx =  new Array(mn,mx);
        return(vmnmx);
    }

    function vSum(list) { // computes the sum of the elements of list
        var tot = 0.0;
        for (var i = 0; i < list.length; i++) {
            tot += list[i];
        }
        return(tot);
    }

    function removeAllBlanks(s){
        return(s.replace(/ +/gm,''));
    }

    function commify(num) { // punctuate number strings greater than 1,000 in magnitude
        var str;
        var strA = (removeAllBlanks(num.toString())).toLowerCase();
        if ( (strA.indexOf('e') > -1) || (strA.indexOf('d') > -1) ) {
            str = strA;  // don't mess with exponential notation
        } else {
            str = strA;
            var curLoc = str.length;
            if ( str.indexOf('.') > -1 ) {
                curLoc = str.indexOf('.');
            }
            var negSign = str.indexOf('-');
            for (var loc = curLoc-4; loc > negSign; loc -= 3) {
                str = str.substr(0,loc+1) + ',' + str.substr(loc+1, str.length);
            }
        }
        return(str);
    }

    function parsePercent(s) {
    // parse a number that contains a % sign to turn it into a decimal fraction
        var value;
        if (s.indexOf('%') == -1) {
            value = parseFloat(trimBlanks(removeCommas(s)))
        } else {
            while (s.indexOf('%') != -1) {
                s = s.substring(0,s.indexOf('%')) +
                    s.substring(s.indexOf('%')+1,s.length)
            }
            value = parseFloat(trimBlanks(removeCommas(s)))/100;
        }
        return(value);
    }

    function roundToDig(num, dig) { // rounds a number or list to dig digits after the decimal place
        var powOfTen = Math.pow(10,dig);
        if ((typeof(num)).toLowerCase() == 'number') {
            var fmt = Math.round(num*powOfTen)/powOfTen;
            return(fmt);
        } else if ((typeof(num)).toLowerCase() == 'object' ||
                   (typeof(num)).toLowerCase() == 'array') {
            var fmt = new Array(num.length);
            for (var i = 0; i < num.length; i++) {
                fmt[i] = Math.round(num[i]*powOfTen)/powOfTen;
            }
            return(fmt);
        } else {
            alert('Error #1 in roundToDig(): argument (' + num.toString() + ') is not a number or an array');
            return(Math.NaN);
        }
    }

    function doubleToStr(num,dig) {
      // returns a string representation of num, rounded to dig digits after the decimal
        return(removeAllBlanks(roundToDig(num,dig).toString()));
    }

    function removeCommas(s) { // removes commas from a string
        return(s.replace(/,/gm,''));
    }

    function trimBlanks(s) { // remove leading and trailing spaces
        s = s.replace(/^ +/gm,'');
        s = s.replace(/ +$/gm,'');
        return(s);
    }
// -->
</script>

<title>Tools for Comparison Risk-Limiting Election Audits</title>

</head>

<body onload="startMe();resetMe();">

</head>
<div id="bodyDiv">

<h1>
   Tools for Comparison Risk-Limiting Election Audits
</h1>

<p>
   This page implements some tools to conduct &quot;comparison&quot; risk-limiting audits as described in
   <a href="http://statistics.berkeley.edu/~stark/Preprints/gentle12.pdf">A Gentle Introduction to
   Risk-Limiting Audits</a> (AGI), by Lindeman and Stark.
   For an implementation of tools for &quot;ballot-polling&quot; risk-limiting audits as described in AGI, see
   <a href="./ballotPollTools.htm">http://statistics.berkeley.edu/~stark/Vote/ballotPollTools.htm</a>.
</p>

<p id="hideAll">
  To hide or show everything but the tools, <a href="#" id="hideAllProse">click this link</a>.
</p>

<p>
   A <em>risk-limiting audit</em> is a procedure that is guaranteed to have a large chance
   of progressing to a full hand count of the votes if the electoral outcome is wrong.
   The outcome according to the hand count then replaces the outcome being audited.
   The <em>risk limit</em> is the maximum chance that the audit will not progress
   to a full hand count if the electoral outcome is incorrect, no matter why it is
   incorrect&mdash;whether because of voter error, bugs, pollworker error, or
   deliberate fraud&mdash;provided the audit trail is complete and accurate.
</p>

<p>
  There are many methods for conducting risk-limiting audits.
  This page performs calculations for a particularly simple method
  described in <a href="http://statistics.berkeley.edu/~stark/Preprints/gentle12.pdf">AGI</a>.
  The method is a type of <em>comparison audit</em>:
  It involves comparing the interpretation of
  ballots according to the voting system (the cast vote record or CVR)
  to a human interpretation of the same ballot.
  Differences between the two interpretations are noted.
  Determining whether the audit can stop depends on the number and nature of
  those differences, the number of ballots examined so far, the risk limit, and the diluted
  margin.
  The smaller the risk limit or the diluted margin, the larger the number of ballots
  that must be audited, all else equal.
</p>

<p>
  The difference can be neutral, an <em>understatement</em>, or
  an <em>overstatement</em>, depending on the effect of changing the
  voting system interpretation of the ballot to match the hand interpretation:
  Consider the <em>pairwise margin</em> between each winner and each loser in a contest.
  For instance, a city council election might involve voting for three candidates
  from a pool of ten, to fill three seats on the council.
  Then each of the three winners can be paired with each of the seven losers,
  giving twenty-one pairwise margins in that contest.
  If changing the interpretation of a ballot according to the voting system to make it match
  the human interpretation of the ballot would widen <em>every</em> pairwise margin in
  <em>every</em> contest
  under audit, that ballot has
  an <em>understatement</em>.
  Understatements do not call the outcome into question.
  If changing the interpretation according to the voting system to match
  the human interpretation would narrow <em>any</em> pairwise margin in <em>any</em> contest
  under audit, the ballot
  has an <em>overstatement</em>.
  If enough ballots have overstatements, the outcome could be wrong.
</p>


<p>
   The sample size calculations for this method depend on the risk limit as well as
   the <em>diluted margin</em>, which is the margin in votes divided by the
   number of ballots cast in any of the contests being audited together, including undervotes and overvotes.
   Undervotes and overvotes are included because they might have been intended as
   votes for candidates, misinterpreted by the voting system as undervotes or overvotes.
   Because the
</p>

<p>
   Efficient risk-limiting audits generally count votes by hand until there is convincing
   evidence that the outcome according to a full hand count would agree
   with the outcome under audit.
   If convincing evidence is not forthcoming, the audit progresses to a full hand count, which
   is used to correct the outcome under audit if the two disagree.
</p>

<p>
   The tools on this page help perform the following steps:
</p>

<ul>
   <li>Choose the number of ballots to audit initially</li>
   <li>Select a random sample of ballots</li>
   <li>Find those ballots using a ballot manifest</li>
   <li>Determine whether the audit can stop, given the differences between the
       machine and human interpretations of the ballots in the
       sample, and if not, estimate how many additional ballots will need to be audited</li>
</ul>

<h2 id="visualizing">Visualizing the required sample size</h2>

<p>
   The ultimate sample size required to confirm the outcome
   depends on the diluted margin and the number of errors (both understatements
   and overstatements) found in the sample,
   as well as the risk limit.
   The following graph plots the sample size as a function of the number of 1-vote
   overstatement errors the audit finds, for diluted margins of 0.5%, 1%, 5%, 10%, and 20%, all at
   risk limit 10%.
   It also plots the expected final sample size as a function of the diluted margin,
   for various rates of observed 1-vote overstatements.
   The plot assumes that there are no 2-vote overstatements and no understatements.
</p>

<h3 id="plotTitle">Expected sample size as a function of the diluted margin, 10% risk limit</h3>
<div id="placeholder" style="width:800px;height:400px"></div>
<p>
   <input type="checkbox" name="byMargin" id="byMargin" value="byMargin"  />Plot final sample size as a function of observed 1-vote overstatements
</p>

<!--
    <p id="hoverdata">Mouse hovers at
    (<span id="x">0</span>, <span id="y">0</span>). <span id="clickdata"></span></p>
-->




<h2>Initial sample size</h2>

<p>
   The initial sample size tool lets you enter the particulars of the contest(s) to be
   audited as a group:
   the total ballots cast across all the contests combined, and the vote totals for each
   candidate in each contest.
   The form helps you anticipate the number of randomly selected
   ballots that will need to be compared to
   their CVRs to attain a given limit on the risk, under assumptions about the
   rates of differences anticipated.
   It is completely legitimate to sample one at a time and check whether enough have been
   sampled using the &quot;stopping sample size tool,&quot; (later in this page) but this
   form can help auditors anticipate how much work will be required
   and retrieve ballots more efficiently, by reducing the number of times a given batch of
   ballots is opened.
</p>

<p>
   Enter the total number of ballots cast in all contests to be audited.
   Add candidates and contests as necessary until the results from all contests have been
   entered.
   Enter the desired risk limit and the expected rates of one- and two-vote differences.
   Select whether to round up the expected number of differences of each type.
   Finally, click &quot;calculate&quot; to find the starting sample size.
</p>



<form action="#" method="get">
		<fieldset>
			<legend>Initial sample size</legend>
			<div>
				<fieldset>
				   <legend>Contest information</legend>
				       <label for="nBallots">Ballots cast in all contests:</label>
                       <input type="text" size="10" name="nBallots" id="nBallots"
			                  onblur="$('#nObj').val(this.value);updateVotes();"/>&nbsp;&nbsp;
			           <span class="label" id="theMargin">Smallest margin (votes): undefined. </span>
			           <span class="label" id="theDilutedMargin">Diluted margin: undefined.</span>

			    	   <div class="contestList"></div>
			           <div class="addRemoveContest" id="addContest">
			                <hr align="left">
			                <input type="button" id="addContestButton" value="Add contest"/>
			                <input type="button" id="removeContestButton" value="Remove last contest"/>
			           </div>
			    </fieldset>
				<fieldset>
				   <legend>Audit parameters</legend>
				       <label for="risk">Risk limit:</label>
			           <input type="text" size="10" name="risk" id="risk" value="10%"
			                  onblur="clearSampleSizes()"/>
                       <br />
                       <span class="label">Expected rates of differences (as decimal numbers): <br />
                       <span class="label">Overstatements.&nbsp;&nbsp;&nbsp;</label><label for="rateOneOver">1-vote:</label>
			           <input type="text" size="10" name="rateOneOver" id="rateOneOver" value="0.001" onblur="$('#startSampleSize').html('&hellip;')" />
			           <label for="rateTwoOver">&nbsp;2-vote:</label>
			           <input type="text" size="10" name="rateTwoOver" id="rateTwoOver" value="0.0001" onblur="$('#startSampleSize').html('&hellip;')"/>
                       <br />
                       <span class="label">Understatements.&nbsp;</label><label for="rateOneUnder">1-vote:</label>
			           <input type="text" size="10" name="rateOneUnder" id="rateOneUnder" value="0.001" onblur="$('#startSampleSize').html('&hellip;')"/>
			           <label for="rateTwoUnder">&nbsp;2-vote:</label>
			           <input type="text" size="10" name="rateTwoUnder" id="rateTwoUnder" value="0.0001" onblur="$('#startSampleSize').html('&hellip;')"/>
                 </fieldset>
            </div>
            <div>
			     <fieldset>
				   <legend>Starting size</legend>
				       <input type="checkbox" name="roundUp1" id="roundUp1" value="roundUp1" checked />
				       <label for="roundUp1">Round up 1-vote differences. </label>
				       <input type="checkbox" name="roundUp2" id="roundUp2" value="roundUp2" />
				       <label for="roundUp2">Round up 2-vote differences. </label>
				       <input type="button" name="startSize" id="startSize" value="Calculate size" />
			       <span class="label" id="startSampleSize">&hellip;</span>
			     </fieldset>
			</div>
		</fieldset>

</form>

<p>
   By default, this form assumes that the rate of one-vote understatements and overstatements
   is one in a thousand (0.001) and that the rate of two-vote understatements and overstatements
   is one in ten thousand (0.0001).
   These values are conservative, in my experience, but the choice is up to the user.
   The larger these rates are assumed to be, the larger the initial sample size will be.
   Taking a larger initial sample can avoid needing to expand the sample later, depending on the
   rate of errors the audit actually finds.
   Avoiding &quot;escalation&quot; can make the audit less complicated.
</p>

<h3 id="considerations">Considerations for deciding which contests to audit together</h3>

<p>
   The number of ballots the audit must examine before stopping depends on the smallest
   diluted margin among the contests to be audited together (as well as the risk limit,
   the errors the audit finds, and so on).
   All else equal, the larger the diluted margin is, the smaller the sample size needs to be.
</p>

<p>
   Because the diluted margin is the smallest margin in votes divided by the total number of
   ballots cast in all the contests under audit,
   auditing small contests together with large contests can be inefficient:
   Dividing the vote margin in small contests by the number of ballots cast in large contests
   can make the diluted margin very small, which makes the required sample very large.
</p>

<p>
   Generally, if two contests overlap substantially&mdash;for instance, if both are jurisdiction-wide
   contests&mdash;it is more economical
   to audit them together:  Fewer ballots will need to be inspected in all.
   Conversely, if two contests do not overlap at all, it is more efficient to audit them separately.
</p>


<p>
   Auditing small contests together with (overlapping) large contests generally is not efficient unless the
   vote margin in the small contests is a substantial fraction of the vote margin in the large
   contests.
   That is, auditing small contests that have large percentage margins together with large contests that
   have small percentage margins
   can be efficient, but auditing small contests together with large contests
   that have comparable vote margins generally is not efficient, because it makes the
   diluted margin of the combination much smaller.
</p>

<p>
   The tool above can be used to explore whether it makes sense to audit a collection of contests
   together by checking whether the required starting sample size when they are audited
   together is greater than the sum of the required starting sample sizes when they are audited
   separately.
   (If you experiment with different groupings of contests, be sure to change the entry for
   &quot;Ballots cast in all contests&quot; to reflect only the contests that are to be audited
   together.)
</p>



<p><a href="#" class="toggleStartingSampleNotes">Show technical notes.</a></p>
<p class="startingSampleNotes notes">
   The initial sample size form implements this formula from
   <a href="http://statistics.berkeley.edu/~stark/Preprints/gentle12.pdf">AGI</a>:
</p>

<p class="center startingSampleNotes notes">
     <em>n<sub>0</sub></em> = <em> -2g log(a)/((m + 2g(r<sub>1</sub>log(1-1/(2g)) +
                       r<sub>2</sub>log(1 - 1/g) + s<sub>1</sub>log(1+1/(2g)) + s<sub>2</sub>log(1+1/g))))</em>
</p>

<p class="startingSampleNotes notes">
   with <em>m</em> equal to the diluted margin, <em>a</em> equal to the risk limit, <em>g</em> = 1.03905,
   <em>r<sub>1</sub></em> the expected rate of 1-vote overstatements per ballot,
   <em>r<sub>2</sub></em> the expected rate of 2-vote overstatements per ballot,
   <em>s<sub>1</sub></em> the expected rate of 1-vote understatements per ballot, and
   <em>s<sub>2</sub></em> the expected rate of 2-vote understatements per ballot.
   The diluted margin is the smallest margin in votes, divided by the total number of ballots
   cast, including undervoted and overvoted ballots.
</p>

<p class="startingSampleNotes notes">
  The number <em>n<sub>0</sub></em> is then adjusted to take into account the fact that
  differences must be round numbers, as follows:
  The expected number of differences in the sample of each type is <em>n<sub>0</sub></em> times the expected
  rate of those differences.
  Depending on which checkboxes are checked, the expected numbers are either rounded to the nearest whole
  number, or rounded up.
  Then those numbers of discrenpancies are plugged into the stopping rule described
  below, to determine how many ballots would have to be audited if the estimated number of differences
  of each type were to be observed in the sample.
  That number is then used once again to estimate the number of differences of each type the sample would contain;
  the results are rounded to the nearest integer and plugged into the stopping rule a second time.
  The result is then the starting sample size.
</p>


<h2>Random sampling</h2>

<p>
   The next tool helps generate a pseudo-random sample of ballots.
   To start,
   input a random seed with at least 20 digits (generated by rolling a 10-sided die, for instance),
   the number of ballots from which you want a sample, and the number of ballots you want in the sample.
   Further below, there is a form to help find the individual, randomly selected
   ballots among the batches in which ballots are stored.
</p>

	<form action="#" method="get">
		<fieldset>
			<legend>Pseudo-Random Sample of Ballots</legend>
			<div>
				<label for="seedValue">Seed:</label>
				<input type="text" size="25" name="seedValue" id="seedValue" onblur="clearList();"
				       value="Input seed here" />
			</div>
			<div>
			    <label for="nObj">Number of ballots:</label>
			    <input type="text" size="10" name="nObj" id="nObj" onblur="clearList();" value="1000"/>
            </div>
			<div>
                 <label for="samNum">Current sample number:</label>
			     <input type="text" size="10" name="samNum" id="samNum" editable="false" value="1"/>
			     <br />
			     <label for="samMany">Draw this many ballots:</label>
			     <input type="text" size="10" name="samMany" id="samMany" value="1"/>
			     <input type="button" name="nextItem" id="nextItem" onclick="nextSample();" value="draw sample" />
			     <input type="button" name="reset" id="reset" onclick="resetMe();" value="reset" />
			</div>
			<br />
			<div>
			   <label for="list">Ballots selected:</label>
			   <input type="checkbox" name="showSequence" id="showSequence" value="showSequence" checked onChange="writeList()" />
			   <label for="showSequence">show sequence numbers</label>

			   <input type="checkbox" name="showHash" id="showHash" value="showHash" onChange="writeList()" />
			   <label for="showHash">show hash values</label>
			   <br />
			   <textarea rows="10" cols="80" name="list" id="list" readonly="readonly"></textarea>
			</div>
			<div>
			   <label for="sortedList">Ballots selected, sorted:</label><br />
			   <textarea rows="10" cols="80" name="sortedList" id="sortedList" readonly="readonly"></textarea>
			</div>
			<div>
			   <label for="sortedDedupeList">Ballots selected, sorted, duplicates removed:</label><br />
			   <textarea rows="10" cols="80" name="sortedDedupeList" id="sortedDedupeList" readonly="readonly"></textarea>
			</div>
			<div>
			   <label for="duplicates">Repeated ballots:</label><br />
			   <textarea rows="10" cols="80" name="duplicates" id="duplicates" readonly="readonly"></textarea>
			</div>
		</fieldset>

</form>

<p>
   <a href="#" class="toggleRandomSampleNotes">Show technical notes.</a>
</p>

<p class="randomSampleNotes notes">
   The &quot;seed,&quot; concatenated with a comma and the &quot;Sample number,&quot; is passed through the
   SHA-256 hash function.
   The result is displayed as &quot;Hashed value (for testing)&quot;.
   The hashed value, interpreted as a hexadecimal number, is divided by
   &quot;Number of objects from which to sample.&quot;
   One is added to the remainder of that division to get &quot;Randomly selected item,&quot;
   which will be a number between 1 and &quot;Number of objects from which to sample,&quot; inclusive.
   Clicking &quot;draw sample&quot; successively adds one to &quot;Sample number&quot; and
   recomputes &quot;Hashed value&quot; and &quot;Randomly selected item&quot;
   &quot;Draw this many objects&quot; times.
   Selected items accumulate in &quot;Ballots selected&quot; (and &quot;Ballots selected, sorted&quot;),
   which reset if the seed or the number of objects changes.
   The same ballot might be selected more than once.
   Duplicates are removed in
   &quot;Ballots selected, duplicates removed.&quot;
   Ballots selected more than once, and the frequencies of those ballots, are in
   &quot;Repeated ballots.&quot;
   Clicking the &quot;reset&quot; button clears the history but leaves the seed.
</p>

<p class="randomSampleNotes notes">
   I learned about this method of generating pseudo-random numbers from
   <a href="http://people.csail.mit.edu/rivest/">Ronald L. Rivest</a>;
   it is related to a method described in
   <a href="http://tools.ietf.org/html/rfc3797">http://tools.ietf.org/html/rfc3797</a>.
   The SHA-256 hash algorithm produces hash values that are hard to predict from the input.
   They are also roughly equidistributed as the input varies.
   The advantages of this approach for election auditing and some other applications
   include the following:
</p>

<ul class="randomSampleNotes notes">
    <li> The SH-256 algorithm is public and many implementations are available in many languages.
         (The Javascript implementation used by this page was written by Brian Turek;
         The JavaScript routines for arithmetic long integers&mdash;the SHA-256 hashed values&mdash;were
         written by Leemon Baird).
    </li>
    <li>
        Given the seed, anyone can verify that the sequence of numbers generated was
        correct&mdash;that it indeed comes from applying SHA-256.
    </li>
    <li>
        Unless the seed is known, the sequence of values generated is unpredictable (so the result
        is hard to &quot;game&quot;).
        It is very hard to distinguish the output from independent, uniformly distributed samples.
    </li>
</ul>

<p class="randomSampleNotes notes">
   For comparison, a reference implementation of this approach in Python written by
   <a href="http://people.csail.mit.edu/rivest/">Ronald L. Rivest</a> is available at
   <a href=" http://people.csail.mit.edu/rivest/sampler.py">http://people.csail.mit.edu/rivest/sampler.py</a>.
</p>

<p class="randomSampleNotes notes">
      For more detail, see
   <a href="http://statistics.berkeley.edu/~stark/Java/Html/sha256Rand.htm">http://statistics.berkeley.edu/~stark/Java/Html/sha256Rand.htm</a>.
</p>



<h2>
   Find ballots using a ballot manifest
</h2>

<p>
   Generally, ballots will be stored in batches, for instance, separated by precinct and mode of voting.
   To make it easier to find individual ballots, it helps to have a <em>ballot manifest</em>
   that describes how the ballots are stored.
   For instance, we might have 1,000 ballots stored as follows:
</p>

<table>
   <tr>
      <th>Batch label</th><th>ballots</th>
   </tr>
   <tr>
      <td>Polling place precinct 1</td> <td>130</td>
   </tr>
      <td>Vote by mail precinct 1</td>  <td>172</td>
   </tr>
   <tr>
      <td>Polling place precinct 2</td> <td>112</td>
   </tr>
      <td>Vote by mail precinct 2</td>  <td>201</td>
   </tr>
   <tr>
      <td>Polling place precinct 3</td> <td>197</td>
   </tr>
      <td>Vote by mail precinct 3</td>  <td>188</td>
   </tr>
</table>


<p>
   If ballot 500 is selected for audit, which ballot is that?
   If we take the listing of batches in the order given by the manifest, and we
   require that within each batch, the ballots are in an order that does not
   change during the audit, then the 500th ballot is the 86th ballot among the vote by mail ballots
   for precinct 2:
   The first three batches have a total of 130+172+112 = 414 ballots.
   The first ballot in the fourth batch is ballot 415.
   Ballot 500 is the 86th ballot in the fourth batch.
</p>

<p>
   The ballot look-up tool transforms a list of ballot numbers and a ballot manifest
   into a list of ballots in each batch.
   Batch labels should not contain commas.
   Use a comma to separate each batch label from the number of ballots in that batch
   (or the range of ballot numbers or the set of ballot identifiers&mdash;see below).
   The manifest should have one line per batch and no empty lines.
</p>

<p>
   For instance, to input the ballot manifest above, you would enter:
</p>

<p>
<pre>
Polling place precinct 1, 130
Vote by mail precinct 1, 172
Polling place precinct 2, 112
Vote by mail precinct 2, 201
Polling place precinct 3, 197
Vote by mail precinct 3, 188
</pre>
</p>

<p>
   Some jurisdictions number the ballots cast in an election.
   If all the ballots in an election are numbered sequentially, the numbers on the ballots that contain
   a particular contest might not be sequential.
   For instance, an election might cover precincts 1, 2, and 3, but
   only voters in precincts 1 and 3 are eligible to vote in the contests to be audited with the current sample.
   In the previous example, suppose that the jurisdiction had stamped numbers on all the ballots, sequentially, so that
   the ballots from the polling place in precinct 1 were numbered 1 to 130, the vote by mail ballots from precinct 1 were
   numbered 131 to 302, the ballots from the polling place in precinct 2 were numbered 303 to 414, and so on,
   as summarized in the following table:
</p>

<table>
   <tr>
      <th>Batch label</th><th>ballot range</th>
   </tr>
   <tr>
      <td>Polling place precinct 1</td> <td>1 to 130</td>
   </tr>
      <td>Vote by mail precinct 1</td>  <td>131 to 302</td>
   </tr>
   <tr>
      <td>Polling place precinct 2</td> <td>303 to 414</td>
   </tr>
      <td>Vote by mail precinct 2</td>  <td>415 to 615</td>
   </tr>
   <tr>
      <td>Polling place precinct 3</td> <td>616 to 812</td>
   </tr>
      <td>Vote by mail precinct 3</td>  <td>813 to 994</td>
   </tr>
   <tr>
      <td>Provisional ballots for precinct 1</td> <td>996, 998, 1000</td>
   </tr>
   <tr>
      <td>Provisional ballots for precinct 2</td> <td>997</td>
   </tr>
   <tr>
      <td>Provisional ballots for precinct 3</td> <td>995, 999</td>
   </tr>
</table>

<p>
   Since the ballots already have numbers on them, it makes sense to look them up using those numbers.
   If we were auditing a collection of contests that included only precincts 1 and 3, the ballots subject to audit
   would be the 686 ballots labeled 1 to 130, 131 to 302, 616 to 812, and 813 to 994, and
   995, 996, 998, and 1000.
   In this case, the ballot manifest would include <em>only</em> the six batches that comprise precincts 1 and 3,
   not all eight batches; there are only 686 ballots in these batches.
   Each line in the manifest would consist of a batch label and a range of ballot numbers,
   where the range is denoted by a colon,
   or of a batch label and a set of ballot identifiers in parentheses, separated by spaces.
   Ballot ranges cannot have gaps: There can be no missing numbers within the range for
   any single batch.
   (If there is in fact a gap, input the numbers as a set of identifiers, rather than as a range.)
   Again, separate the label from the range or set of ballot numbers by a comma.
   The label must not contain any commas,
   and the range of ballot numbers or set of identifiers must not contain commas.
   In this example, we would enter the ballot manifest as follows:
</p>

<p>
<pre>
Polling place precinct 1, 1:130
Vote by mail precinct 1, 131:302
Polling place precinct 3, 616:812
Vote by mail precinct 3, 813:994
Provisional precinct 1, (996 998 1000)
Provisional precinct 3, (995 999)
</pre>
</p>

<p>
   The total number of ballots in the manifest must equal the number cast in the contests that are to be
   audited together using the sample (686 in this example).
</p>

	<form action="#" method="get">
		<fieldset>
			<legend>Ballot look-up tool</legend>
			<div>
			    <label for="manifest">Ballot manifest: Each line must have a batch label, a comma, and one of the following:<br />
			                          &nbsp;&nbsp;(i) the number of ballots in the batch <br />
			                          &nbsp;&nbsp;(ii) a range specified with a colon (e.g., 131:302), or <br />
			                          &nbsp;&nbsp;(iii) a list of ballot identifiers within parentheses, separated by spaces (e.g., (996 998 1000)).<br />
			                          Each line should have exactly one comma.<br />
			                          </label><br />
				<textarea rows="25" cols="80" name="manifest" id="manifest"></textarea>
			</div>
			<div>
			   <label for="ballotList">Ballots to look up (separated by commas):</label><br />
			   <textarea rows="10" cols="80" name="ballotList" id="ballotList" ></textarea>
			</div>
			<div>
			    <input type="button" id="lookUpBallot" name="lookUpBallot"
			       onclick="lookUpBallots($('#ballotList').val().split(',').sort(numberLessThan), true);"
			       value="look up ballots" />
		    </div>
			<div>
			   <label for="lookUp">Sorted lookup table:</label><br />
			   <textarea rows="25" cols="80" name="lookUp" id="lookUp" readonly="readonly"></textarea>
			</div>
		</fieldset>

</form>

<h2>Should more ballots be audited?</h2>

<p>
   The stopping sample size tool determines whether enough ballots have been examined for the audit to stop,
   and if not, estimates how many more ballots will need to be audited.
   The answer depends on the risk limit, the margin, and the differences between the cast vote
   records and the manual inspection of the ballots in the sample.
</p>

<p>
  Differences matter according to how they affect the <em>pairwise margin</em> between some winner and
  some loser in some contest.
  Suppose we are auditing a mayoral contest with four candidates, a city council contest that allows voting
  for up to three of ten candidates, and
  a simple measure that involves voting either &quot;yes&quot; or &quot;no.&quot;
  The mayoral contest has three pairwise margins: The winner can be paired with each of
  the three losers.
  The city council contest has twenty-one pairwise margins: each of the three winners can be
  paired with each of the seven losers.
  The measure has but one pairwise margin, since it has only one winner and one loser.
  In all, there are 3+21+1 = 25 pairwise margins among the three contests being audited.
</p>

<p>
  If there is any difference between the cast vote record and the human interpretation of
  a ballot, that ballot as a whole may have an understatement of one or two votes,
  or an overstatement of one or two votes.
  No matter how many contests on the ballot have differences and no matter how many
  candidates in those
  contests have differences, the ballot as a whole has
  an understatement of one or two votes, or an overstatement of
  one or two votes, or neither an understatement nor an overstatement.
  (Of course, the sample might contain many ballots in each of these categories.)
</p>

<p>
  If changing the interpretation of the ballot according to the voting system to make it match
  the human interpretation of the ballot would widen <em>every</em> pairwise margin in
  <em>every</em> contest
  under audit, that ballot has
  an <em>understatement</em>.
  If it would widen <em>every</em> pairwise margin in <em>every</em> contest by two votes, the
  ballot has a two-vote
  understatement; otherwise it has a one-vote understatement.
  If the ballot does not contain every contest under audit, it cannot have an understatement.
  Since there is an understatement only if changing the machine interpretation of the ballot
  to match the hand interpretation would increase <em>every</em> pairwise margin, understatements
  are quite rare.
  Understatements do not call the outcome into question, so they do not increase the
  sample size required to confirm the outcome.
</p>

<p>
  If changing the interpretation of the ballot according to the voting system to match
  the human interpretation of the ballot would narrow <em>any</em>
  pairwise margin in <em>any</em> contest
  under audit, that ballot has an <em>overstatement</em>.
  If changing the interpretation of the ballot according to the voting system to match
  the human interpretation of the ballot would narrow <em>any</em> pairwise margin in
  <em>any</em> contest under audit by two votes, that ballot
  has a two-vote overstatement.
  No matter how many margins would be narrowed by one or two votes, the overstatement on a
  ballot is at most two votes, because only the maximum overstatement enters the calculations.
  If enough ballots have overstatements, the outcome could be wrong, so overstatements
  increase the sample size required to confirm the outcome.
</p>

<p>
   As an example, suppose that we are auditing five contests simultaneously.
   Tables&nbsp;1 and&nbsp;2 below show two hypothetical CVRs and manual interpretations of the
   same ballots.
</p>

<div class="indent">
<table rules="all">
   <tr>
       <th>&nbsp;</th><th align="center">contest 1</th><th align="center">contest 2</th>
           <th align="center">contest 3</th><th align="center">contest 4</th><th align="center">contest 5</th>
   </tr>
   <tr>
       <td>CVR</td>         <td>undervote</td> <td>winner</td>  <td>loser </td>              <td>not on ballot</td> <td>winner</td>
   </tr>
   <tr>
       <td>Hand</td>        <td>loser</td>     <td>loser</td>   <td>winner</td>              <td>loser</td>         <td>not on ballot</td>
   </tr>
   <tr>
       <td>discrepancy</td> <td>1 over</td>    <td>2 over</td>  <td>2 under<sup>**</sup></td> <td>1 over</td>       <td>1 over</td>
   </tr>
   <caption>
        Table 1: Hypothetical CVR and hand interpretation
        of a ballot that contains four of five contests under audit.
        Overall, the ballot has an overstatement of 2 votes, because that is the largest overstatement of
        any margin in any of the contests.
   </caption>
</table>
   <p>
        <sup>**</sup>Contest 3 has an understatement of 2 votes <em>only</em> if the contest has only two candidates.
        If there are two or more losers in the contest (and only one winner), this contest has an understatement
        of only one vote,
        because only one pairwise margin was understated by two votes; the others were overstated by one vote.
        Similarly, if there are two or more winners in the contest and only one loser, this contest has an understatement
        of only one vote.
        If there are at least two winners and at least two losers, there is no understatement in this contest, because
        at least one pairwise margin was not affected at all by the discrepancy.
        Regardless, the <em>ballot</em> has an overstatement of 2 votes, because the ballot has an overstatement of 2 votes
        in contest 2.
   </p>

<table rules="all">
   <tr>
       <th>&nbsp;</th><th align="center">contest 1</th><th align="center">contest 2</th>
           <th align="center">contest 3</th><th align="center">contest 4</th><th align="center">contest 5</th>
   </tr>
   <tr>
       <td>CVR</td>         <td>winner</td>     <td>winner</td>      <td>undervote </td>   <td>not on ballot</td> <td>winner</td>
   </tr>
   <tr>
       <td>Hand</td>        <td>overvote</td>   <td>undervote</td>   <td>loser</td>        <td>loser</td>         <td>not on ballot</td>
   </tr>
   <tr>
       <td>discrepancy</td> <td>1 over</td>    <td>1 over</td>       <td>1 over</td>       <td>1 over</td>       <td>1 over</td>
   </tr>
   <caption>
        Table 2: Hypothetical CVR and hand interpretation
        of a ballot that contains four of five contests under audit.
        Overall, the ballot has an overstatement of 1 vote, because that is the largest overstatement of
        any margin in any of the contests.
   </caption>
</table>

</div>

<p>
  To determine whether the audit can stop, enter the number of ballots in the sample
  with overstatements or understatements of one or two votes, then
  click &quot;Calculate.&quot;
  If the sample size is not large enough to confirm the outcome based on the
  number of differences of each type observed, the value of
  &quot;If no more discrepancies are observed&quot; will be larger than
  the current sample size, and the value of
  &quot;Estimated additional ballots if difference rate stays the same&quot;
  will be greater than zero.
  That value is the estimated number of additional ballots that will need
  to be audited to confirm the outcome at the desired risk limit,
  assuming that the rate of one and two-vote understatements and overstatements
  does not change as the sample expands.
</p>



<form action="#" method="get">
		<fieldset>
			<legend>Stopping sample size and escalation</legend>
			  <div>
				<fieldset>
<!-- 				   <legend>Discrepant Ballots</legend>
				   <div id="ballotErrList" class="ballotErrList">
				   </div>
				   <hr align="left" />
				   <div id="addRemoveBallots">
				     <input type="button" id="addBallotButton" value="Add discrepant ballot">
                     <input type="button" id="removeBallotButton" value="Remove last ballot">
                   </div>
-->
                      <span class="label" id="sizeSoFar">Ballots audited so far: 0</span>
                      <hr align="left"/>
                      <label for="oneOver">1-vote overstatements:</label>
			          <input type="text" size="10" name="oneOver" id="oneOver" value="0"
			               onblur="clearStops();$('#obsRateOneOver').html('Rate: ' + doubleToStr(this.value/$('#samNum').val(),4));"/>
			          <span class="label" id="obsRateOneOver">Rate: </span>
			          <br />
			          <label for="twoOver">2-vote overstatements:</label>
			          <input type="text" size="10" name="twoOver" id="twoOver" value="0"
			              onblur="clearStops();$('#obsRateTwoOver').html('Rate: ' + doubleToStr(this.value/$('#samNum').val(),4));"/>
			          <span class="label" id="obsRateTwoOver">Rate: </span>
			          <br />
                      <label for="oneUnder">1-vote understatements:</label>
			          <input type="text" size="10" name="oneUnder" id="oneUnder" value="0"
			              onblur="clearStops();$('#obsRateOneUnder').html('Rate: ' + doubleToStr(this.value/$('#samNum').val(),4));"/>
			          <span class="label" id="obsRateOneUnder">Rate: </span>
			          <br />
			          <label for="twoUnder">2-vote understatements:</label>
			          <input type="text" size="10" name="twoUnder" id="twoUnder" value="0"
			              onblur="clearStops();$('#obsRateTwoUnder').html('Rate: ' + doubleToStr(this.value/$('#samNum').val(),4));"/>
			          <span class="label" id="obsRateTwoUnder">Rate: </span>
			          <br />
			    </fieldset>
            </div>
            <div>
                <fieldset>
                   <legend>Estimated stopping size</legend>
			     <input type="button" name="stopping" id="stopping" onclick="findNmin();"
			          value="Calculate" />
			          <span class="label" id="auditComplete">&nbsp;Audit incomplete&nbsp;</span>
			     <br />
			     <span class="label" id="stopSampleSize"> If no more differences are observed: &hellip;</span>
			     <br />
			     <span class="label" id="estStopSampleSize"> If differences continue at the same rate:  &hellip; . </span>
			     <br />
			     <span class="label" id="additionalBallots"> Estimated additional ballots if difference
			                                                 rate stays the same: &hellip; </span>
			</div>
		</fieldset>

</form>

<p>
   If the contest being audited has more than two candidates or positions,
   the calculation above can be very conservative if overstatements do not affect the
   margin between the winner with the fewest votes and the loser with the most votes.
   The formula above can be modified to take that into account.
</p>

<p>
   <a href="#" class="toggleEndingSampleNotes">Show technical notes.</a>
</p>

<p class="endingSampleNotes notes">
   The stopping rule implements the following formula from
   <a href="http://statistics.berkeley.edu/~stark/Preprints/gentle12.pdf">AGI</a>:
</p>

<p class="center endingSampleNotes notes">
  stopping sample size =   <em>-2g(log(a) + o<sub>1</sub>log(1-1/(2g)) +
              o<sub>2</sub>log(1 - 1/g) + u<sub>1</sub>log(1+1/(2g)) + u<sub>2</sub>log(1+1/g)) / m)</em>
</p>
<p class="endingSampleNotes notes">
   with <em>m</em> equal to the diluted margin, <em>a</em> equal to the risk limit,
   <em>o<sub>1</sub></em> the number of 1-vote overstatements in the sample,
   <em>o<sub>2</sub></em> the number of 2-vote overstatements in the sample,
   <em>u<sub>1</sub></em> the number of 1-vote understatements in the sample, and
   <em>u<sub>2</sub></em> the number of 2-vote understatements in the sample.
   In the tool below,  <em>g</em> = 1.03905, but any value greater than one can be used.
   For <em>g</em> = 1.03905, a two-vote overstatement increases the sample
   size by five times as much as a one-vote overstatement.
</p>

<p class="endingSampleNotes notes">
   The estimates based on differences continuing to occur at the observed rate are
   based on the method described above for estimating the initial sample size,
   including the method of rounding the expected number of differences of each
   type.
</p>


<p>
<small>P.B. Stark, <a href="statistics.berkeley.edu/~stark">statistics.berkeley.edu/~stark</a>.
http://statistics.berkeley.edu/~stark/Java/Html/auditTools.htm
Last modified 19 August 2014.</small>
</p>

</body>

</html>

