/* globals $ */
$(document).ready(function() {
    "use strict";
    var url;
    var responses;
    var addresses;
    var j;
    var current_report_index;
    var recent_url;
    var live;
    var decodedText;
    var insecure_links;
    var neededkeys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var started = false;
    var count = 0;
    var test;

    $(document).keydown(function(e) {
        var key = e.keyCode;
        //Set start to true only if having pressed the first key in the konami sequence.
        if (!started) {
            if (key == 38) {
                started = true;
            }
        }
        //If we've started, pay attention to key presses, looking for right sequence.
        if (started) {
            if (neededkeys[count] == key) {
                //We're good so far.
                count++;
            } else {
                //Oops, not the right sequence, lets restart from the top.
                reset();
            }
            if (count == 10) {
                //We made it! Put code here to do what you want when successfully execute konami sequence
                alert("You found it!");
                //Reset the conditions so that someone can do it all again.
                reset();
            }
        } else {
            //Oops.
            reset();
        }
    });
    //Function used to reset us back to starting point.
    function reset() {
        started = false;
        count = 0;
        return;
    }


    // Hitting the enter key on the input will press the button
    $("#url").keyup(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#scan_button").click();
        }


    });

    // Pressing the scan button
    $("#scan_button").on('click', function() {


        // get URL
        url = $("#url").val();
        var advanced = $("#advanced").is(':checked'); //"advanced report" option

        // update address bar
        var slug = "/?url=" + url;
        window.history.pushState("string", "SSL Scanner: " + url, slug);
        $("#inseclinks").hide();
        //If url is equal to url stored in cookie, do a live scan
        if ($("#url").val() == (Cookies.get('recent_url'))) {
            live = true;
        } else
            live = false;

        if ($("#url").val().indexOf('.') == -1) {
            alert('Make sure you have entered a TLD (.com, .net, .org, etc.)');
        } else
            scan(url, advanced, live);
    });



    // Clicking on the text == clicking on the check box
    $("#live_scan_label").on('click', function(e) {
        e.stopPropagation();
        $("#live_scan").prop('checked', !$("#live_scan").prop("checked"));
    });
    $("#advanced_label").on('click', function(e) {
        e.stopPropagation();
        $("#advanced").prop('checked', !$("#advanced").prop("checked"));
        toggle_advanced_report();
    });

    $("#live_scan").on('click', function(e) {
        e.stopPropagation();
    });
    $("#advanced").on('click', function(e) {
        e.stopPropagation();
        toggle_advanced_report();
    });



    function toggle_advanced_report() {
        //Toggling advanced report
        if ($("#advanced").is(':checked')) {
            $("#advanced_report").slideDown();
        } else {
            $("#advanced_report").slideUp();
        }
    }

    // Link to navigate to different sections of the report
    $("#report").on('click', '.link', function() {
        //the id we want to navigate to is embedded in the id of this link
        //the id of this link will be `link_${id_to_navigate_to}`
        //we will remove the "link_" part (first 5 characters)
        var id = ($(this).attr('id')).substring(5);
        $('html, body').animate({
            scrollTop: $('#' + id).offset().top
        }, 1000);
    });

    // Populating the modal when it is shown
    $('#certModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var cert_level = parseInt(button.data('level')); // Extract the level of the cert to show
        var cert = responses[current_report_index];
        for (var i = 0; i < cert_level; i++) cert = cert.issuerCertificate; // Get matching certificate
        // Update the modal's content
        var modal = $(this);
        modal.find('.modal-title').text(cert.subject.CN);
        modal.find('#cert_body').html(cert.dump.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    });

    // Pressing the refresh button should start a new live scan
    $("#refresh").on('click', function() {
        $("#live_scan").prop('checked', true); // Check the "Live Scan" checkbox
        scan(url, $("#advanced").is(':checked')); // Start the scan  
        $("#live_scan").prop('checked', false); // Check the "Live Scan" checkbox   
    });

    function scan(url, advanced, liveScan) {
        //hide input and report (if visible)
        $("#input").slideUp();
        $("#report").slideUp();
        saveQuery(url);
        var live_scan = liveScan; //"live scan report" option
        //show loading screen
        $("#scan_subject").html("Scanning " + url);
        $("#progress").html("Getting Servers");
        $("#progress").css("width", 0);
        $("#loader").slideDown();

        responses = [{}];
        j = 0;

        //Get the IP addresses mapping to the domain
        $.ajax({
            type: 'POST',
            url: '/api/dns',
            data: {
                url: url, //URL
            },
            dataType: 'JSON',
            success: function(data) {
                //received IP addresses
                addresses = data.addresses;
                j = addresses.length;

                //check for lack of addresses
                if (j == 0) {
                    scan_error();
                    scan_complete();
                    return;
                }

                //submit POST request to scan each address recieved and options
                function ajax(i) {
                    var p = "" + (100 - Math.floor(((j - 1) / addresses.length) * 100)) + "%";
                    $("#progress").html("Server " + (addresses.length - j + 1) + " of " + addresses.length);
                    $("#progress").css("width", p);
                    $.ajax({
                        type: 'POST',
                        url: '/api/scan',
                        data: {
                            url: data.host,
                            ip: addresses[i],
                            path: data.path,
                            port: data.port,
                            live_scan: live_scan,
                            advanced: advanced
                        },
                        dataType: 'JSON',
                        timeout: 4500,
                        success: callback,
                        error: fail
                    });
                }

                function callback(data) {

                    //add response to result set
                    if (!data.response) {
                        data.response = {};
                    }
                    next(data.response);
                }

                function fail(request, status, err) {
                    next({});
                }

                function next(report) {
                    //we received the result
                    j--;

                    responses.push(report);

                    //show reports if we've received at least one
                    if (responses.length == 2) {
                        prepareReports();
                    } else {
                        addReport();
                    }

                    //Check if we're done
                    if (j == 0) {
                        //scan complete
                        scan_complete();
                    } else {
                        ajax(j - 1);
                    }
                };

                //initial scan
                ajax(j - 1);
            }
        });
    }

    function scan_complete() {
        //hide loading screen
        $("#loader").slideUp();

        //show input again
        $("#input").slideDown();
    }

    $("#servers").on('click', '.report_button', function() {
        $('#report_body').hide();
        $('.report_button').removeClass('active');
        $(this).addClass('active');

        current_report_index = parseInt($(this).attr('id'));
        $('#timeout').hide();
        if (Object.keys(responses[current_report_index]).length > 0) {
            formatReport(responses[current_report_index]);
        } else {
            $('#timeout').slideDown();
        }
    });

    function scan_error() {
        $("#error").slideDown().delay(1500).slideUp();
    }

    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var QueryString = (function() {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    })();

    // If a "url" parameter was passed in the URL, start a scan for this url
    if (QueryString.hasOwnProperty('url')) {
        url = QueryString.url;
        $("#url").val(url);
        if (QueryString.hasOwnProperty('advanced') && QueryString.advanced == 'true') {
            $("#advanced").prop('checked', true);
            toggle_advanced_report();
        }
        scan(QueryString.url, (QueryString.advanced == 'true'));
    }

    //Save url to db
    function saveQuery(url) {

        $.ajax({
            type: 'POST',
            url: '/api/query',
            data: {
                url: url
            },
            dataType: 'JSON',
            timeout: 4500,
            error: fail

        });

        function fail(request, status, err) {
            console.log(err);
        }
    }


    function prepareReports() {
        $("#servers").html("");
        addReport();
        $("#report").slideDown();
        $("#1").click();
    }

    function addReport() {
        var i = responses.length - 1;
        $("#servers").append('<li class="report_button" id="' + i + '"><a>' + (addresses[j]) + '</a></li>');
    }

    function formatReport(data) {
        // Clear up wildcard from url
        if (data.url.indexOf("%") == 0) {
            data.url = data.url.substring(1);
        }

        //Update URL input field
        //$("#url").val(data.url);

        //Scan time and duration
        if (data.live == undefined) {

            $("#scan_time").html("Scan completed on " + data.scan_time + " after " + data.scan_duration + " seconds. <b>[CACHED COPY]</b>");

        } else {
            $("#scan_time").html("Scan completed on " + data.scan_time + " after " + data.scan_duration + " seconds. ");
        }

        //Subject Info
        $("#common_name").text(data.subject.CN || "N/A");
        $("#organization").text(data.subject.O || "N/A");
        $("#locality").text(data.subject.L || "N/A");
        $("#state").text(data.subject.ST || "N/A");
        $("#country").text(data.subject.C || "N/A");
        $("#ip_address").text(data.ip_address || "N/A");
        $("#server_signature").text(data.server || "N/A");

        //SAN Entries
        var cert_name_match = false;
        try {
            var san_string = "";
            var san = data.san_entries;

            var san_links = [];
            for (var i = 0; i < san.length; i++) {
                if (san[i].indexOf("%") == 0) {
                    var t = san[i].substring(1);
                    san_links[i] = t;
                    san[i] = '*.' + t;
                } else {
                    san_links[i] = san[i];
                }
            }
            for (var i = 0; i < san.length; i++) {
                san_string += '<a href="/?url=' + san_links[i] + '">' + san[i] + '</a>, ';
            }
            san_string = san_string.substring(0, san_string.length - 2) + ".";

            //check for certificate name mismatch
            for (var i = 0; i < san.length; i++) {
                if (data.url.match(new RegExp("^" + san[i].replace("*.", "(.*\\.+)*") + "$", 'i'))) {
                    cert_name_match = true;
                    continue;
                }
            }
            if (!(cert_name_match)) {
                san_string += '<hr /><div class="alert alert-danger" role="alert"><strong><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> Certificate Name Mismatch! </strong> ' + data.url + ' is not a SAN entry.</div>';
            }

            $("#san_entries").html(san_string);
        } catch (e) {
            $("#san_entries").html("");
        }

        //Cert Type
        var glyph_class = (data.cert_type == "EV") ? "glyphicon-star-empty" : (data.cert_type == "OV") ? "glyphicon-ok" : "glyphicon-exclamation-sign";
        $("#cert_type_glyph").removeClass();
        $("#cert_type_glyph").addClass("glyphicon " + glyph_class);
        $("#cert_type_text").text(data.cert_type);

        //Certificate Chain
        var chain = '';
        var cert = data;
        var root_cert = data;
        var i = 0;
        while (cert) {
            //add arrow (if not server)
            if (cert != data) chain += '<div class="row arrow"><h1><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></h1></div>';
            //cert name and type (server / intermediate / root)
            chain += '<div class="row center"><div class="col-sm-6"><h1>' + (cert.subject.O || cert.subject.CN) + '</h1><h3>'
            chain += (cert == data) ? "Server Certificate" : (cert.issuerCertificate) ? "Intermediate Certificate" : "Root Certificate";
            chain += '</h3><div class="btn-group" role="group" aria-label="Download/View Certificate"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#certModal" data-level="' + i + '">&nbsp;View Details&nbsp;</button><a type="button" class="btn btn-primary" href="/api/download?type=crt&id=' + cert.id + '">Download (PEM)</a><a type="button" class="btn btn-primary" href="/api/download?type=der&id=' + cert.id + '">Download (DER)</a></div></div><div class="col-sm-6">';
            //cert attributes
            chain += '<div class="row left"><b><div class="col-xs-4">Common Name: </div><div class="col-xs-8">' + (cert.subject.CN || "N/A") + '</div></b></div>';
            chain += '<div class="row left"><div class="col-xs-4">Location: </div><div class="col-xs-8">' + (cert.subject.C || "N/A") + '</div></div>';
            chain += '<div class="row left"><div class="col-xs-4">Valid From: </div><div class="col-xs-8">' + (cert.valid_from || "N/A") + '</div></div>';
            chain += '<div class="row left"><b><div class="col-xs-4">Valid To: </div><div class="col-xs-8">' + (cert.valid_to || "N/A") + '</div></b></div>';
            chain += '<div class="row left"><div class="col-xs-4">Serial No.: </div><div class="col-xs-8">' + (cert.serialNumber || "N/A") + '</div></div>';
            chain += '<div class="row left"><b><div class="col-xs-4">Issuer: </div><div class="col-xs-8">' + (cert.issuer.CN || "N/A") + '</div></b></div>';
            chain += '</div></div>';
            root_cert = cert;
            cert = cert.issuerCertificate;
            i++;
        }
        // Warning for incomplete certificate chain
        if (data.self_signed) {
            var alert = '<br><hr/><br><p><strong><div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> ';
            if (root_cert == data) {
                alert += 'This certificate is self signed and may not be trusted by some browsers.';
            } else {
                alert += 'The root certificate in this chain is not trusted by some browsers.';
            }
            chain += alert + '</strong></p></div>';
        } else if (!(data.chain_of_trust_complete)) {
            var alert = '<br><hr/><br><div class="alert alert-danger" role="alert">';
            // If we have the certificate for download, offer the user the link
            if (root_cert.next_cert_id) {
                alert += '<p class="pull-right"><a href="/api/chain?type=crt&id=' + root_cert.next_cert_id + '" class="btn btn-danger">Download the Chain Here</a></p>';
            }
            alert += '<p><strong>Error! The next certificate in the chain is missing.</strong> The next certificate should be: "' + (root_cert.issuer.CN || "N/A") + '".</p>';
            chain += alert + '</div>';
        }
        $("#cert_chain").html(chain);

        //Insecure Links
        function links(name) {

            $.ajax({
                type: 'POST',
                url: '/api/links',
                data: {
                    name: name
                },
                dataType: 'JSON',
                timeout: 4500,
                success: callback,
                error: fail


            });

            function callback(data) {

                insecure_links = (data.match(/<(link|img)(link.+href|.+?(data-\w+|src|xlink\:href))=["'](http:[^s]).+?>/gi) || []);
                for (var i = 0; i < insecure_links.length; i++) {
                    insecure_links[i] = insecure_links[i].replace(/</gi, '&lt;');
                    insecure_links[i] = insecure_links[i].replace(/>/gi, '&gt;');
                }
                var insecure_links_count = insecure_links.length;
                $("#insecure_links_left").html('');
                if (insecure_links_count > 0) {

                    //Insecure Links List
                    $("#insecure_links_left").html('<p>');
                    for (var i = 0; i < insecure_links_count; i++) {
                        $("#insecure_links_left").append('<li>' + insecure_links[i] + '</li>' + '<br>');
                    }
                    $("#insecure_links_left").append('</p>');
                    $("#inseclinks").slideDown();
                }
            }

            function fail(request, status, err) {
                console.log(err);
            }
        }
        links(url);


        //Report Summary

        function add_checklist_item(name, checked, checked_desciption, alt_description) {
            var grade = checked;
            var description = (checked) ? checked_desciption : alt_description;
            if (grade) {
                $('#installation_summary').append('<div class="row center"><div class="col-md-5"><h3>' + name + '</h3></div><div class="col-md-2"><span style="color:green; font-weight:600; font-size:3em;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span></div><div class="col-md-5 textContainer"><p>' + description + '</p></div></div><hr\>');
            } else
                $('#installation_summary').append('<div class="row center pink-alert"><div class="col-md-5"><h3>' + name + '</h3></div><div class="col-md-2"><span style=" font-weight:600; font-size:3em;"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div><div class="col-md-5 textContainer"><p>' + description + '</p></div></div><hr\>');
        }

        //Installation Summary
        $('#installation_summary').html('');
        var warnings = 0;

        //Name mismatch
        add_checklist_item("Domain Check", cert_name_match, '<b> ' + data.url + ' </b>exists in the list of <a id="link_san_entries_section" class="link"><b>SAN entries</b>.<a>', '' + data.url + ' does not exist in the list of <a id="link_san_entries_section" class="link"><b>SAN entries</b>.<a>')

        //Certificate Validity
        var valid_to = new Date(data.valid_to);
        var current_date = new Date();
        var difference_days = (valid_to.getTime() - current_date.getTime()) / (1000 * 60 * 60 * 24);
        add_checklist_item("Certificate Validity", (difference_days >= 0), 'This certificate will expire in <b>' + (Math.floor(difference_days)) + ' days.</b>', 'This certificate expired ' + Math.floor((difference_days) * -1) + ' days ago.');

        //Self Signed
        add_checklist_item("Trusted CA", !(data.self_signed), "This Certificate Authority is trusted.", 'This Certificate Authority may not be trusted. Check your <a id="link_cert_chain_section" class="link">certificate chain</a> for more information.');

        //Chain of Trust
        if (!data.self_signed) {
            add_checklist_item("Certificate Chain", data.chain_of_trust_complete, 'This <a id="link_cert_chain_section" class="link"><b>certificate chain</b></a> is complete.', 'This <a id="link_cert_chain_section" class="link"><b>certificate chain</b></a> is incomplete.');
            add_checklist_item("Revocation Status", !(data.revoked), "This certificate has not been revoked.", "This certificate has been revoked.");
        }

        $("#installation_summary hr").last().remove(); // Remove horizontal line between last summary item and end of div

        //Store URL in cookie
        if (recent_url != ($("#url").val())) {
            recent_url = ($("#url").val());
            Cookies.set('recent_url', recent_url);
            //alert(Cookies.get('recent_url'));
        }


        //show report
        $('#report_body').fadeIn('slow');
    }

    //------------------------------------------------------------------------------------------------------

    //Start of DECODER

    $("#csr").on('paste', function() {
        var element = this;
        setTimeout(function() {
            var text = $(element).val();
            var csr = $('#csr').val();
            if (!(csr.match(new RegExp(/-----BEGIN/i)))) {
                $('#csrFail').slideDown().delay(1500).slideUp();
            } else {
                if (csr.match(new RegExp(/REQUEST/i))) {
                    $("#csrAlert").slideDown().delay(1500).slideUp();
                } else
                    $("#certAlert").slideDown().delay(1500).slideUp();
            }
        }, 100);
    });

    $("#decoderSubmit").on('click', function() {
        $("decodeBody").html("<div></div>");
        var body = $('#csr').val();
        var csr;
        if (!(body.match(/-----BEGIN/i))) {
            $('#csrFail').slideDown().delay(1500).slideUp();
        } else {
            body.match(/REQUEST/i) ? csr = true : csr = false;
        }
        $('#csrBody').hide();
        $('#certBody').hide();
        $('#csr_san').html(" ");
        $('#san').html(" ");
        decode(body, csr);
    });

    var request;

    function decode(body, csr) {

        $.ajax({
            type: 'POST',
            url: '/api/decoder',
            data: {
                body: body,
                csr: csr
            },
            dataType: 'JSON',
            timeout: 4500,
            success: callback,
            error: fail


        });

        function callback(data) {

            if (!csr) {
                if (data.slice(0, 12) != 'Certificate:') {
                    $("#badCert").show();
                } else {
                    certFormat(data);
                }
            }
            if (csr) {
                if (data.slice(0, 20) != 'Certificate Request:')
                    $("#badCSR").show();
                else {
                    csrFormat(data);
                }
            }
        }

        function csrFormat(csrIn) {

            //Bool value to determine whether or not to show SAN entries panel
            var sanExist = false;

            //Format CSR
            var csr = csrIn.replace(/(?:\r\n|\r|\n)/g, '<br />');

            //Separate Subject line from CSR for easier manipulation
            var subject = csr.match(/Subject:.*</gi);
            subject = subject[0];

            //Find individual fields in the Subject line
            var name = subject.match(/cn=.*?(<|\/|,)/gi);
            var org = subject.match(/o=.*?,/gi);
            var l = subject.match(/L=.*?(,|\/)/gi);
            var s = subject.match(/ST=.*?,/gi);
            var c = subject.match(/C=../gi);

            //See if any DNS entries exist
            var san = csr.match(/DNS:.*?(,|<)/gi);
            //If they do, set it to true
            if (san) {
                sanExist = true;
                //Send the entries to get formatted. Receives formatted entries.
                var sans = sanFormat(san);
                //Depending on the position of the entry in the array, place either a , or . after it.
                for (let i = 0; i < sans.length; i++) {
                    $('#csr_san').append(sans[i] + (i == sans.length - 1 ? "." : ', '));
                }
            }


            //Clean up strings
            var fields = [name, org, l, s, c];
            for (var i = 0; i < fields.length; i++) {
                if (fields[i] !== null) {
                    switch (i) {
                        case 0:
                            fields[i][0] = fields[i][0].slice(3, fields[i][0].length - 1);
                            break;
                        case 1:
                            fields[i][0] = fields[i][0].slice(2, fields[i][0].length - 1);
                            break;
                        case 2:
                            fields[i][0] = fields[i][0].slice(2, fields[i][0].length - 1);
                            break;
                        case 3:
                            fields[i][0] = fields[i][0].slice(3, fields[i][0].length - 1);
                            break;
                        case 4:
                            fields[i][0] = fields[i][0].slice(2, fields[i][0].length).toUpperCase();
                            break;
                    }
                    fields[i] = fields[i][0];
                }
            }

            //Remove sha1, md5, and key size fields from CSR
            var sha1Index = csr.indexOf('sha1:') + 5;
            var md5Index = csr.indexOf('md5') + 4;
            var keyIndex = csr.indexOf('Public-Key: (') + 13;
            var sha1 = csr.slice(sha1Index, sha1Index + 40);
            var md5 = csr.slice(md5Index, md5Index + 32);
            var key = csr.slice(keyIndex, keyIndex + 4) + ' bits';

            //Populate each field in table, or 'N/A' if null
            $('#cn').html(name || 'N/A');
            $('#o').html(org || 'N/A');
            $('#loc').html(l || 'N/A');
            $('#st').html(s || 'N/A');
            $('#c').html(c || 'N/A');
            $('#sha1').html(sha1 || 'N/A');
            $('#md5').html(md5 || 'N/A');
            $('#key').html(key || 'N/A');

            //Populate Dump
            $('#csr_body').html(csrIn.replace(/(?:\r\n|\r|\n)/g, '<br />'));
            if (sanExist)
                $('#csrSAN').show();
            $('#csrBody').show();
            //Smooth Scroll down to table
            $('html, body').animate({
                scrollTop: $("#csrSummary").offset().top
            }, 2000);

        }

        function certFormat(certIn) {
            //Format cert
            var cert = certIn.replace(/(?:\r\n|\r|\n)/g, '<br>');
            //Separate Issuer line from cert
            var issuer = cert.slice(cert.indexOf('Issuer:'), cert.indexOf('Validity'));
            //Separate Subject line from Cert
            var subject = cert.match(/Subject:.*?</gi);
            subject = subject[0];
            //Find individual fields
            var name = subject.match(/cn=.*?(<|\/|,)/gi);
            name = name[0];
            var vfIndex = cert.indexOf('Not Before:');
            var vtIndex = cert.indexOf('Not After :');
            var snIndex = cert.indexOf('Serial') + 15;
            var issIndex = issuer.indexOf('CN');
            var sha1Index = cert.indexOf('sha1') + 5;
            var md5Index = cert.indexOf('md5') + 4;
            var keyIndex = cert.indexOf('Public-Key: (') + 13;
            //Modify strings to remove unnecessary chars
            var cn = name.slice(3, name.length - 1);
            var vf = cert.slice(vfIndex + 12, vfIndex + 36);
            var vt = cert.slice(vtIndex + 12, vtIndex + 36);
            var sn = cert.slice(snIndex + 4, cert.indexOf('Signature'));
            var iss = issuer.slice(issIndex + 3, issuer.length);
            var sa = cert.slice(cert.indexOf('Algorithm:') + 11, cert.indexOf('Issuer:'));
            var sha1 = cert.slice(sha1Index, sha1Index + 40);
            var md5 = cert.slice(md5Index, md5Index + 32);
            var pkl = cert.slice(keyIndex, keyIndex + 4) + ' bits';
            //Find SAN entries
            var sanstring = cert.match(/DNS:.*?(,|<)/gi);
            //Send SAN entries to be formatted
            if (sanstring) {
                var san = sanFormat(sanstring);

                san.map(function(curr, i, arr) {
                    $('#san').append(arr[i] + (i == arr.length - 1 ? "." : ', '));
                });
            }


            //Populate fields
            $('#cn1').html(cn);
            $('#vf').html(vf);
            $('#vt').html(vt);
            $('#sn').html(sn);
            $('#iss').html(iss);
            $('#sa').html(sa);
            $('#pkl').html(pkl);
            $('#dCert_body').html(cert);
            $('#certBody').show();
            $('html, body').animate({
                scrollTop: $("#certSummary").offset().top
            }, 2000);
        }

        function sanFormat(body) {
            var san_links = body;
            var sans = [];
            //Removes 'DNS:' from the front and ',' or '<' from the end
            san_links.map(function(curr, i, arr) {
                sans[i] = arr[i].slice(4, arr[i].length - 1);
            });
            //Send em back
            return sans;
        }


        function fail(request, status, err) {
            console.log(err);
        }
    }
});
