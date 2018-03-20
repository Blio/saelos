import React from 'react'
import PropTypes from 'prop-types'
import { fetchOpportunity } from "../../opportunities/service"
import * as MDIcons from 'react-icons/lib/md'
import Select from 'react-select'
import { saveContact } from "../../contacts/service"
import { saveCompany } from "../../companies/service"
import { searchOpportunities } from "../service";


class Opportunities extends React.Component {
  constructor(props) {
    super(props)

    this._submit = this._submit.bind(this)
    this._toggleAdd = this._toggleAdd.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
    this._searchOpportunities = this._searchOpportunities.bind(this)

    this.state = {
      formState: {
        id: props.entityId,
        opportunity: {
          id: null,
          name: null
        }
      },
      adding: false
    }
  }

  _toggleAdd(e) {
    e.stopPropagation()

    this.setState({adding: !this.state.adding})
  }

  _searchOpportunities(input) {
    let search = '';

    if (input && input.length > 0) {
      search = {
        searchString: input
      }
    }

    return searchOpportunities(search)
      .then(opportunities => {
        let options = opportunities.map(c => ({
            id: c.id,
            name: c.name
          })
        )

        return {options}
      })
  }

  _handleInputChange(e) {
    const { target } = e
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { formState } = this.state

    _.set(formState, name, value)

    this.setState({
      formState
    })
  }

  _submit(e) {
    const { dispatch } = this.props
    const opportunities = this.props.opportunities.map(c => c.originalProps)

    opportunities.push(this.state.formState.opportunity)

    const submitProps = {
      id: this.state.formState.id,
      deals: opportunities
    }

    switch (this.props.entityType) {
      case 'App\\Person':
        dispatch(saveContact(submitProps))
        break
      case 'App\\Company':
        dispatch(saveCompany(submitProps))
        break
    }

    this._toggleAdd(e)
  }
  render() {
    const { opportunities, dispatch } = this.props;
    return (
  <div className="card">
    <div className="card-header" id="headingOpportunities">
      <span className="float-right" onClick={this._toggleAdd}>
        <strong>+ Add</strong>
      </span>
      <h6 className="mb-0" data-toggle="collapse" data-target="#collapseOpportunities" aria-expanded="true" aria-controls="collapseOpportunities">
        <MDIcons.MdKeyboardArrowDown /> Opportunities <span className="text-muted font-weight-normal">({opportunities.length})</span>
      </h6>
    </div>

    {this.state.adding ?
      <div id="addCompany" className="py-2 px-3 border-bottom">
        <Select.Async
          value={this.state.formState.opportunity && this.state.formState.opportunity.id ? this.state.formState.opportunity : null}
          multi={false}
          loadOptions={this._searchOpportunities}
          labelKey='name'
          valueKey='id'
          onChange={(value) => {
            const event = {
              target: {
                type: 'select',
                name: 'opportunity',
                value: value
              }
            }

            this._handleInputChange(event);
          }}
        />
        <button className="btn btn-primary" onClick={this._submit}>Add</button>
      </div>
      : ''}

    <div id="collapseOpportunities" className="collapse show mh-200" aria-labelledby="headingOpportunities">
      <div className="list-group border-bottom">
        {opportunities.map(opportunity => <Opportunity key={opportunity.id} opportunity={opportunity} router={this.context.router} dispatch={dispatch} />)}
      </div>
    </div>
  </div>
)}
}

const Opportunity = ({ opportunity, dispatch, router }) => {
  const openOpportunityRecord = (id) => {
    dispatch(fetchOpportunity(opportunity.id))
    router.history.push(`/opportunities/${id}`)
  }

  return (
    <div onClick={() => openOpportunityRecord(opportunity.id)} className="list-group-item list-group-item-action align-items-start">
      <p className="mini-text text-muted float-right">{opportunity.status}</p>
      <p><strong>{opportunity.name}</strong>
      <br />{opportunity.company.name}</p>
    </div>
  );
}


Opportunities.propTypes = {
  opportunities: PropTypes.array.isRequired
}

Opportunities.contextTypes = {
  router: PropTypes.object
}

export default Opportunities