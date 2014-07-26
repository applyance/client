require_relative '_errors'
require_relative 'main'
require_relative 'accounts/_init'
require_relative 'spots'

module Applyance
  module Routing
    module Init
      def self.registered(app)
        app.register Applyance::Routing::Errors
        app.register Applyance::Routing::Main
        app.register Applyance::Routing::Accounts::Init
        app.register Applyance::Routing::Spots
      end
    end
  end
end