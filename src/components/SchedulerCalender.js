import React from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
  DragDropProvider,
  DateNavigator,
  Toolbar,
  TodayButton,
  ViewSwitcher,
  MonthView,
  DayView
} from "@devexpress/dx-react-scheduler-material-ui";
import moment from "moment";

export default class SchedulerCalender extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentDate: moment().format("YYYY-MM-DD"),

      addedAppointment: {},
      appointmentChanges: {},
      editingAppointmentId: undefined,
    };

    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(
      this
    );
    this.currentDateChange = this.currentDateChange.bind(this);
    this.currentViewNameChange = this.currentViewNameChange.bind(this);
    this.getDataFromLocalStorage = this.getDataFromLocalStorage.bind(this);
    this.setDataInLocalStorage = this.setDataInLocalStorage.bind(this);
  }

  componentDidMount() {
    this.getDataFromLocalStorage();
  }

  getDataFromLocalStorage() {
    const data = JSON.parse(window.localStorage.getItem('schedule')) || [];
    this.setState({data});
  }

  setDataInLocalStorage() {
    const data = JSON.stringify(this.state.data) || [];
    window.localStorage.setItem('schedule', data);
  }

  componentDidUpdate() {
    this.setDataInLocalStorage();
  }

  currentViewNameChange(currentViewName) {
    this.setState({ currentViewName });
  }

  currentDateChange(currentDate) {
    this.setState({ currentDate });
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointmentId(editingAppointmentId) {
    this.setState({ editingAppointmentId });
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added && data) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
      }
      return { data };
    });
  }

  render() {
    const {
      currentDate,
      data,
      addedAppointment,
      appointmentChanges,
      editingAppointmentId,
      currentViewName
    } = this.state;

    return (
      <Paper>
        <Scheduler data={data} height={screen.height}>
            <ViewState
            defaultCurrentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={this.currentViewNameChange}
          />
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={this.currentDateChange}
          />
          <EditingState
            onCommitChanges={this.commitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={this.changeAddedAppointment}
            appointmentChanges={appointmentChanges}
            onAppointmentChangesChange={this.changeAppointmentChanges}
            editingAppointmentId={editingAppointmentId}
            onEditingAppointmentIdChange={this.changeEditingAppointmentId}
          />
          <WeekView 
            startDayHour={7}
            endDayHour={22}

            />
          <MonthView />
          <DayView />
          <Toolbar />
          <ViewSwitcher />
          <AllDayPanel />
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip showOpenButton showDeleteButton />
          <AppointmentForm />
          <DragDropProvider />
          <EditRecurrenceMenu />
          <DateNavigator />
          <TodayButton />
        </Scheduler>
      </Paper>
    );
  }
}
