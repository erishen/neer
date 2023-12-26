import { NextPageContext } from 'next'
import ErrorComponent from 'neer/error'

class CustomError extends ErrorComponent {
  static getInitialProps({ res }: NextPageContext) {
    const statusCode = 500
    return { statusCode, title: 'CustomError' }
  }
}

export default CustomError
