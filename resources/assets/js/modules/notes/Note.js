import Model from '../../utils/Model'
import User from '../../modules/user/User'
import Account from '../../modules/accounts/Account'

class Note extends Model {
  constructor(props) {
    super(props)

    this.initialize(props)
  }

  initialize(props) {
    super.initialize(props)

    this.published = props.published || 0
    this.note = props.note || ''    

    // relate user model
    this.user = props.user ? new User(props.user) : new User({})
    this.company = props.company ? new Account(props.company) : new Account({})
    this.contacts = props.people || []
    this.notes = props.notes || []
  }
}

export default Opportunity