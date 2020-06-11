$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result1').hide();
    $('#prob1').hide();
    $('#summary1').hide();
    $('#result2').hide();
    $('#prob2').hide();
    $('#summary2').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result1').text('');
        $('#result1').hide();
        $('#prob1').hide().text('');
        $('#prob1').hide();
        $('#summary1').hide().text('');
        $('#summary1').hide();
        $('#result2').text('');
        $('#result2').hide();
        $('#prob2').hide().text('');
        $('#prob2').hide();
        $('#summary2').hide().text('');
        $('#summary2').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);
        // Show loading animation
        $(this).hide();
        $('.loader').show();
        $('#upload-file').hide()

        // Make prediction by calling api /predict
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                console.log(data);
                var prediction1 = data[0].name;
                var probability1 =data[0].probability;
                var summary1 = data[0].summary
                var prediction2 = data[1].name;
                var probability2 =data[1].probability;
                var summary2 = data[1].summary
                $('.loader').hide();
                $('#result1').fadeIn(600);
                $('#prob1').fadeIn(600);
                $('#summary1').fadeIn(600);
                $('#result2').fadeIn(600);
                $('#prob2').fadeIn(600);
                $('#summary2').fadeIn(600);
                $('#upload-file').hide()
                $('#result1').text(' Result 1:  ' + prediction1);
                $('#prob1').text(' Probability:  ' + probability1);
                $('#summary1').text(summary1);
                $('#result2').text(' Result 2:  ' + prediction2);
                $('#prob2').text(' Probability:  ' + probability2);
                $('#summary2').text(summary2);
                console.log(data);
            },
        });
    });

});