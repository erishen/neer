import { useRouter } from 'neer/router'

export default () => <p id="product">product: {useRouter().query.productId}</p>
