from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta

def get_last_month_range():
    today = datetime.now()
    first_day_current_month = today.replace(day=1)
    last_day_last_month = first_day_current_month - timedelta(days=1)
    first_day_last_month = last_day_last_month.replace(day=1)
    return first_day_last_month, last_day_last_month

def get_last_quarter_range():
    today = datetime.now()
    first_day_current_month = today.replace(day=1)
    last_day_last_quarter = first_day_current_month - timedelta(days=1)
    # Go back 3 months from the last_day_last_quarter
    first_day_last_quarter = last_day_last_quarter.replace(day=1) - relativedelta(months=2)
    return first_day_last_quarter, last_day_last_quarter

def format_date_range(start_date, end_date):
    return f"{start_date.strftime('%B %d, %Y')} - {end_date.strftime('%B %d, %Y')}"
