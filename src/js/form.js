/**
 * @module pka/Form
 */

class Form {
  constructor(content) {
    this.content = content
    $('#birth-year').val(content.message('birth_year'));
    $('#start-year').val(content.message('start_year'));
    $('#student-dob-note').html(content.message('form_dob_msg'));
    
  }
}
