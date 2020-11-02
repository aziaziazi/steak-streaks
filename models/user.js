var { DateTime } = require('luxon');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    steak_dates: [Date],
  }
);

// Virtual for user's streaks
UserSchema
  .virtual('streaks')
  .get(function () {
    return this.steak_dates.map((date, index) => {
      // handle first date
      if (i === 0) return {date, days_since_last_date: 0};

      const thisDate = DateTime.fromJSDate(date);
      const lastDate = DateTime.fromJSDate(this.steak_dates[index - 1]);
      const diffInDays = thisDate.diff(lastDate, 'day');

      return {date, diffInDays}
    })
  });

module.exports = mongoose.model('Author', UserSchema);